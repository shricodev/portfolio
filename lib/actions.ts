'use server'

import { ContactFormEmailTemplate } from '@/components/contact-email-template'
import {
  ContactFormSchema,
  TContactFormSchema,
} from '@/lib/validators/contact-form'
import { Resend } from 'resend'
import { env } from '@/lib/env'
import { BASE_URL, OTHER_EMAIL } from '@/lib/constants'
import { headers } from 'next/headers'

const resend = new Resend(env.RESEND_API_KEY)

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const rateLimitStore = new Map<string, number[]>()

type TResponse = {
  error: { message: string } | null
  success: boolean
}

type TSendEmailResponse = TResponse

async function sendEmailResend(data: TContactFormSchema) {
  const senderEmail = env.RESEND_FROM_EMAIL

  const { email, name, message } = data
  return await resend.emails.send({
    from: senderEmail,
    to: OTHER_EMAIL,
    replyTo: email,
    subject: 'Portfolio: Contact Form Submission',
    react: ContactFormEmailTemplate({
      name,
      email,
      message,
    }) as React.ReactElement,
  })
}

function isRateLimited(identifier: string, now = Date.now()): boolean {
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const recentRequests = (rateLimitStore.get(identifier) ?? []).filter(
    timestamp => timestamp > windowStart,
  )

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(identifier, recentRequests)
    return true
  }

  recentRequests.push(now)
  rateLimitStore.set(identifier, recentRequests)

  // Keep the best-effort in-memory limiter bounded on long-lived servers.
  if (rateLimitStore.size > 1000) {
    for (const [key, timestamps] of rateLimitStore) {
      if (timestamps.every(timestamp => timestamp <= windowStart)) {
        rateLimitStore.delete(key)
      }
    }
  }

  return false
}

async function getRequestIdentity(): Promise<string | null> {
  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin')
  const allowedOrigins = new Set([
    BASE_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ])

  if (origin && !allowedOrigins.has(origin)) return null

  return (
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    requestHeaders.get('x-real-ip') ||
    'unknown'
  )
}

export async function sendEmail(
  data: TContactFormSchema,
): Promise<TSendEmailResponse> {
  const requestIdentity = await getRequestIdentity()
  if (!requestIdentity) {
    return { success: false, error: { message: 'Request rejected.' } }
  }

  if (isRateLimited(requestIdentity)) {
    return {
      success: false,
      error: { message: 'Too many requests. Please try again later.' },
    }
  }

  const validatedResponse = ContactFormSchema.safeParse(data)
  if (!validatedResponse.success) {
    return { error: { message: 'Invalid form submission.' }, success: false }
  }

  try {
    const { data: resendData, error: resendError } = await sendEmailResend(
      validatedResponse.data,
    )

    if (!resendData || resendError) {
      console.error('Resend rejected contact-form email:', resendError)
      return { success: false, error: { message: 'Unable to send message.' } }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Contact-form email failed:', error)
    return {
      success: false,
      error: { message: 'Unable to send message.' },
    }
  }
}

'use server'

import { ContactFormEmailTemplate } from '@/components/contact-email-template'
import {
  ContactFormSchema,
  type TContactFormSchema,
} from '@/lib/validators/contact-form'
import { Resend } from 'resend'
import { env } from '@/lib/env'
import { BASE_URL, OTHER_EMAIL } from '@/lib/constants'
import { headers } from 'next/headers'

const resend = new Resend(env.RESEND_API_KEY)

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const rateLimitStore = new Map<string, number[]>()

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>
  // echoed back so a failed submit doesn't wipe what was typed
  values?: { name: string; email: string; message: string }
}

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

function field(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function submitContactForm(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    message: field(formData, 'message'),
  }
  const fail = (message: string): ContactFormState => ({
    status: 'error',
    message,
    values,
  })

  // Bots fill the hidden field. Tell them it worked and send nothing.
  if (field(formData, 'website')) return { status: 'success' }

  const parsed = ContactFormSchema.safeParse(values)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      status: 'error',
      message: 'Please fix the highlighted fields.',
      fieldErrors: {
        name: errors.name?.[0],
        email: errors.email?.[0],
        message: errors.message?.[0],
      },
      values,
    }
  }

  const requestIdentity = await getRequestIdentity()
  if (!requestIdentity) return fail('Request rejected.')

  if (isRateLimited(requestIdentity)) {
    return fail('Too many messages in a short time. Please try again later.')
  }

  try {
    const { data, error } = await sendEmailResend(parsed.data)
    if (!data || error) {
      console.error('Resend rejected contact-form email:', error)
      return fail('The message could not be sent. Please email me instead.')
    }
    return { status: 'success' }
  } catch (error) {
    console.error('Contact-form email failed:', error)
    return fail('The message could not be sent. Please email me instead.')
  }
}

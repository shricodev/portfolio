'use server'

import { ContactFormEmailTemplate } from '@/components/contact-email-template'
import {
  ContactFormSchema,
  TContactFormSchema,
} from '@/lib/validators/contact-form'
import { CreateContactResponse, Resend } from 'resend'
import { TNewsletterFormSchema } from '@/lib/validators/newsletter-form'
import { env } from '@/lib/env'
import { OTHER_EMAIL } from '@/lib/constants'

const resend = new Resend(env.RESEND_API_KEY)

type TResponse = {
  error: { message: string } | null
  success: boolean
}

type TSendEmailResponse = TResponse

export async function saveContactsResend(
  data: TNewsletterFormSchema,
): Promise<CreateContactResponse> {
  const { email } = data
  return await resend.contacts.create({
    email,
    audienceId: env.RESEND_AUDIENCE_ID,
  })
}

async function sendEmailResend(data: TContactFormSchema) {
  const senderEmail = env.RESEND_FROM_EMAIL

  const { email, name, message } = data
  return await resend.emails.send({
    from: senderEmail,
    to: OTHER_EMAIL,
    cc: [senderEmail, email],
    subject: 'Portfolio: Contact Form Submission',
    react: ContactFormEmailTemplate({ name, email, message }) as React.ReactElement,
  })
}

export async function sendEmail(
  data: TContactFormSchema,
): Promise<TSendEmailResponse> {
  const validatedResponse = ContactFormSchema.safeParse(data)
  if (!validatedResponse.success) {
    const errorMessage = JSON.stringify(validatedResponse.error.format())
    return { error: { message: errorMessage }, success: false }
  }

  try {
    const { data: resendData, error: resendError } = await sendEmailResend(
      validatedResponse.data,
    )

    if (!resendData || resendError) {
      return { success: false, error: { message: String(resendError) } }
    }

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

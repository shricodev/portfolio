import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required.' })
    .min(2, { message: 'Must be at least 2 characters.' })
    .max(80, { message: 'Must be at most 80 characters.' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required.' })
    .email('Invalid email.')
    .max(254, { message: 'Must be at most 254 characters.' }),
  message: z
    .string()
    .trim()
    .min(1, { message: 'Message is required.' })
    .max(5000, { message: 'Must be at most 5,000 characters.' }),
  website: z.string().max(0).optional(),
})

export type TContactFormSchema = z.infer<typeof ContactFormSchema>

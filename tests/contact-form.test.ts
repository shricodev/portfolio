import { describe, expect, test } from 'bun:test'
import { ContactFormSchema } from '@/lib/validators/contact-form'

describe('ContactFormSchema', () => {
  test('accepts and normalizes a valid submission', () => {
    const result = ContactFormSchema.parse({
      name: '  Ada Lovelace  ',
      email: '  ada@example.com  ',
      message: '  Hello from the contact form.  ',
      website: '',
    })

    expect(result).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello from the contact form.',
      website: '',
    })
  })

  test('rejects submissions that fill the bot-trap field', () => {
    const result = ContactFormSchema.safeParse({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello from the contact form.',
      website: 'https://spam.example',
    })

    expect(result.success).toBe(false)
  })

  test('rejects oversized fields', () => {
    const result = ContactFormSchema.safeParse({
      name: 'A'.repeat(81),
      email: 'ada@example.com',
      message: 'M'.repeat(5001),
    })

    expect(result.success).toBe(false)
  })
})

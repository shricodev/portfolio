'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { submitContactForm, type ContactFormState } from '@/lib/actions'
import { PUBLIC_GMAIL } from '@/lib/constants'

const INITIAL_STATE: ContactFormState = { status: 'idle' }

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className='text-destructive mt-1.5 text-xs'>
      {message}
    </p>
  )
}

export const Contact = () => {
  const [state, formAction, isPending] = useActionState(
    async (previous: ContactFormState, formData: FormData) => {
      try {
        return await submitContactForm(previous, formData)
      } catch {
        // network drop or the server being unreachable
        return {
          status: 'error',
          message: `Could not reach the server. Please email ${PUBLIC_GMAIL} instead.`,
        } satisfies ContactFormState
      }
    },
    INITIAL_STATE,
  )

  if (state.status === 'success') {
    return (
      <div
        role='status'
        className='border-border bg-card mt-10 rounded-lg border p-6'
      >
        <p className='font-medium'>Message sent.</p>
        <p className='text-muted-foreground mt-1 text-sm'>
          Thanks for reaching out. I usually reply within a couple of days.
        </p>
      </div>
    )
  }

  const errors = state.fieldErrors ?? {}
  const labelClass = 'mb-1.5 block text-sm font-medium'

  return (
    <form action={formAction} className='mt-10'>
      {/* honeypot, real people never see or fill this */}
      <div
        aria-hidden='true'
        className='absolute top-auto left-[-10000px] size-px overflow-hidden'
      >
        <label htmlFor='website'>Leave this field empty</label>
        <input id='website' name='website' tabIndex={-1} autoComplete='off' />
      </div>

      <div className='grid gap-5 sm:grid-cols-2'>
        <div>
          <label htmlFor='name' className={labelClass}>
            Name
          </label>
          <Input
            id='name'
            name='name'
            required
            minLength={2}
            maxLength={80}
            autoComplete='name'
            defaultValue={state.values?.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className='h-10'
          />
          <FieldError id='name-error' message={errors.name} />
        </div>

        <div>
          <label htmlFor='email' className={labelClass}>
            Email
          </label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            maxLength={254}
            autoComplete='email'
            defaultValue={state.values?.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className='h-10'
          />
          <FieldError id='email-error' message={errors.email} />
        </div>

        <div className='sm:col-span-2'>
          <label htmlFor='message' className={labelClass}>
            Message
          </label>
          <Textarea
            id='message'
            name='message'
            rows={7}
            required
            maxLength={5000}
            defaultValue={state.values?.message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className='max-h-72'
          />
          <FieldError id='message-error' message={errors.message} />
        </div>
      </div>

      <div className='mt-6 flex flex-wrap items-center gap-x-4 gap-y-3'>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Sending...' : 'Send message'}
        </Button>
        <p className='text-muted-foreground text-xs'>
          By sending this you agree to the{' '}
          <Link href='/privacy' className='underline underline-offset-4'>
            privacy policy
          </Link>
          .
        </p>
      </div>

      <p role='alert' className='text-destructive mt-4 min-h-5 text-sm'>
        {state.status === 'error' ? state.message : ''}
      </p>
    </form>
  )
}

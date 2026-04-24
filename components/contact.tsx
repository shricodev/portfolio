'use client'

import {
  TContactFormSchema,
  ContactFormSchema,
} from '@/lib/validators/contact-form'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendEmail } from '@/lib/actions'
import Link from 'next/link'
import { Loader } from '@/components/icons'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'

export const Contact = () => {
  const form = useForm<TContactFormSchema>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const handleFormSubmit: SubmitHandler<TContactFormSchema> = async (
    data: TContactFormSchema,
  ) => {
    const { success } = await sendEmail(data)

    if (!success) return toast.error('Something went wrong!')

    toast.success('Message sent successfully!')

    form.reset()
  }

  return (
    <section className='flex flex-col gap-8'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className='mt-16 lg:flex-auto'
          noValidate
        >
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold uppercase text-zinc-700 dark:text-zinc-400'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id='name'
                        autoFocus
                        placeholder='Enter your name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-rose-500' />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold uppercase text-zinc-700 dark:text-zinc-400'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id='email'
                        placeholder='Enter your email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-rose-500' />
                  </FormItem>
                )}
              />
            </div>

            <div className='sm:col-span-2'>
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold uppercase text-zinc-700 dark:text-zinc-400'>
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={8}
                        id='message'
                        placeholder='Enter your message...'
                        className='max-h-72'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-rose-500' />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='mt-6'>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='w-full disabled:opacity-50'
            >
              {form.formState.isSubmitting ? (
                <Loader className='mr-2 size-5 animate-spin' />
              ) : null}
              Contact me
            </Button>
          </div>
          <p className='mt-4 text-xs text-muted-foreground'>
            By submitting this form, I agree to the{' '}
            <Link
              href='/privacy'
              className='font-bold hover:text-foreground hover:underline hover:underline-offset-2 hover:transition'
              target='_blank'
              rel='noreferrer noopener'
            >
              privacy&nbsp;policy.
            </Link>
          </p>
        </form>
      </Form>

      <div className='flex flex-col gap-4'>
        <p className='font-medium text-zinc-800 dark:text-zinc-300'>
          Interested to chat on your ideas or work with me? Schedule a meeting
          using the button below.
        </p>
        <Link
          href='/meet'
          className={buttonVariants({
            variant: 'secondary',
            className: 'max-w-fit',
          })}
        >
          Book a meet
        </Link>
      </div>
    </section>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const NewsletterForm = () => {
  return (
    <section className='mb-10 mt-24'>
      <div className='relative'>
        {/* The original form, fully visible but non-interactive */}
        <Card className='rounded-lg border-0 select-none dark:border'>
          <CardContent className='flex flex-col gap-8 pt-6 md:flex-row md:justify-between md:pt-8'>
            <div className='flex-grow'>
              <h2 className='text-2xl font-bold'>Subscribe to my newsletter</h2>
              <p className='text-muted-foreground'>
                Get recent projects &amp; blog updates to your inbox.
              </p>
            </div>

            <div className='flex flex-grow flex-col items-start gap-3'>
              <div className='w-full'>
                <label className='mb-2 block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-400'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='Enter your email...'
                  className='w-full'
                  disabled
                  tabIndex={-1}
                />
              </div>

              <div className='w-full'>
                <Button className='w-full' disabled tabIndex={-1}>
                  Subscribe
                </Button>
              </div>

              <p className='text-xs text-muted-foreground'>
                I never share your email.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Overlay */}
        <div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[2px]'>
          <div className='flex flex-col items-center gap-2'>
            <div className='relative size-16'>
              <div className='absolute inset-0 rotate-45 rounded-full border-4 border-muted-foreground/40' />
              <div className='absolute left-1/2 top-1/2 h-[4px] w-12 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-muted-foreground/40' />
            </div>
            <p className='text-sm font-semibold text-muted-foreground'>
              Newsletter coming soon
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

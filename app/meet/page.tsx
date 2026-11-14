import { CalMeet } from '@/components/cal-meet'
import { ArrowUpRightIcon } from '@/components/icons'
import { BASE_URL, CAL_LINK, PUBLIC_GMAIL } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a call',
  description:
    'Schedule a 30 minute call with Shrijal Acharya to talk about a project, a role, or a collaboration.',
  alternates: {
    canonical: new URL('/meet', BASE_URL).toString(),
  },
}

export default function Page() {
  const linkClass =
    'text-foreground inline-flex items-center gap-0.5 underline underline-offset-4'

  return (
    <section>
      <h1 className='title'>Book a call</h1>
      <p className='lede mb-8'>
        Pick a 30 minute slot that works for you. If the calendar does not load,{' '}
        <a
          href={`https://cal.com/${CAL_LINK}`}
          target='_blank'
          rel='noreferrer noopener'
          className={linkClass}
        >
          open it on Cal.com
          <ArrowUpRightIcon className='size-3.5' />
        </a>{' '}
        or email{' '}
        <a href={`mailto:${PUBLIC_GMAIL}`} className={linkClass}>
          {PUBLIC_GMAIL}
        </a>
        .
      </p>
      <CalMeet />
    </section>
  )
}

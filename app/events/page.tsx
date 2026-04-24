import type { Metadata } from 'next'
import { EventsList } from '@/components/events/events-list'
import { EVENTS } from '@/lib/events'
import { BASE_URL } from '@/lib/constants'

const pageDescription =
  'Some of the talks, workshops, and community sessions I’ve hosted, mostly shared on LinkedIn.'

export const metadata: Metadata = {
  title: 'Events',
  description: pageDescription,
  alternates: {
    canonical: new URL('/events', BASE_URL).toString(),
  },
  openGraph: {
    title: 'Events',
    description: pageDescription,
    url: new URL('/events', BASE_URL).toString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events',
    description: pageDescription,
  },
}

export default function Page() {
  return (
    <section>
      <h1 className='title'>Events</h1>
      <p className='mb-8 text-sm text-muted-foreground'>{pageDescription}</p>
      <EventsList events={EVENTS} />
    </section>
  )
}

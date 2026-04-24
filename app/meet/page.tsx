import { CalMeet } from '@/components/cal-meet'
import { BASE_URL } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meeting',
  description:
    'Let’s set up a time to chat! Schedule a meeting with me, and we can discuss your ideas or projects.',
  alternates: {
    canonical: new URL('/meet', BASE_URL).toString(),
  },
}

export default function Page() {
  return (
    <section>
      <h1 className='title'>Schedule a Meet</h1>
      <div className='rounded-lg'>
        <CalMeet />
      </div>
    </section>
  )
}

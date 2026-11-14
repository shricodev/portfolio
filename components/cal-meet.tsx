'use client'

import dynamic from 'next/dynamic'

// Cal's script is heavy and only matters on this page, so load it on the
// client after the page itself is up.
const CalEmbed = dynamic(() => import('@/components/cal-embed'), {
  ssr: false,
  loading: () => (
    <p className='text-muted-foreground flex h-full items-center justify-center text-sm'>
      Loading the calendar...
    </p>
  ),
})

export const CalMeet = () => {
  return (
    // fixed height so nothing below moves when the calendar appears
    <div className='border-border bg-card h-[640px] overflow-hidden rounded-lg border sm:h-[680px]'>
      <CalEmbed />
    </div>
  )
}

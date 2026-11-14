import Image from 'next/image'
import { ArrowUpRightIcon } from '@/components/icons'
import { formatDate } from '@/lib/utils'
import type { EventItem } from '@/lib/events'

interface EventCardProps {
  event: EventItem
  preload?: boolean
}

export function EventCard({ event, preload = false }: EventCardProps) {
  return (
    <article className='border-border bg-card overflow-hidden rounded-lg border'>
      <a
        href={event.postUrl}
        target='_blank'
        rel='noopener noreferrer'
        tabIndex={-1}
        aria-hidden='true'
        className='border-border bg-muted block border-b'
      >
        <Image
          src={event.image.src}
          alt={event.image.alt}
          width={event.image.width}
          height={event.image.height}
          sizes='(max-width: 768px) 100vw, 720px'
          preload={preload}
          className='h-auto w-full'
        />
      </a>
      <div className='p-5'>
        <time
          dateTime={event.date}
          className='text-muted-foreground font-mono text-xs'
        >
          {formatDate(event.date, 'short')}
        </time>
        <h2 className='mt-1.5 text-base font-medium'>{event.title}</h2>
        <p className='text-muted-foreground mt-1.5 text-sm leading-6'>
          {event.description}
        </p>
        <a
          href={event.postUrl}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`View ${event.title} on LinkedIn`}
          className='text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-1 text-sm'
        >
          View on LinkedIn
          <ArrowUpRightIcon className='size-3.5' />
        </a>
      </div>
    </article>
  )
}

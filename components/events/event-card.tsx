import type { ReactNode } from 'react'
import Image from 'next/image'
import { LinkedInIcon } from '@/components/icons'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { EventItem, EventPlatform } from '@/lib/events'

type PlatformMeta = {
  label: string
  icon: ReactNode
  badgeClass: string
  viewLabel: string
}

const PLATFORM_META: Record<EventPlatform, PlatformMeta> = {
  linkedin: {
    label: 'LinkedIn',
    icon: <LinkedInIcon className='size-3.5' aria-hidden='true' />,
    badgeClass:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    viewLabel: 'View on LinkedIn',
  },
}

function getPlatformMeta(platform: EventPlatform): PlatformMeta {
  return PLATFORM_META[platform]
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='size-3.5'
      aria-hidden='true'
    >
      <path d='M15 3h6v6' />
      <path d='M10 14 21 3' />
      <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
    </svg>
  )
}

interface EventCardProps {
  event: EventItem
  priority?: boolean
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const meta = getPlatformMeta(event.platform)
  const formattedDate = formatDate({ date: event.date, short: true })

  return (
    <article className='flex flex-col gap-4 rounded-lg border border-border bg-zinc-50 p-6 dark:bg-zinc-900'>
      <div className='flex items-start justify-between gap-3'>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
            meta.badgeClass,
          )}
        >
          {meta.icon}
          {meta.label}
        </span>
        {formattedDate && (
          <time
            dateTime={event.date}
            className='text-xs text-muted-foreground'
          >
            {formattedDate}
          </time>
        )}
      </div>

      <div>
        <a
          href={event.postUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='text-lg font-semibold text-foreground hover:underline hover:underline-offset-4'
        >
          <h2>{event.title}</h2>
        </a>
        <p className='mt-1 text-sm text-muted-foreground'>
          {event.description}
        </p>
      </div>

      <Separator />

      <a
        href={event.postUrl}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`${meta.viewLabel}: ${event.title}`}
        className='group block overflow-hidden rounded-md border border-border bg-zinc-100 dark:bg-zinc-950'
      >
        <Image
          src={event.image.src}
          alt={event.image.alt}
          width={event.image.width}
          height={event.image.height}
          sizes='(max-width: 768px) 100vw, 736px'
          priority={priority}
          className='h-auto w-full transition-transform duration-200 group-hover:scale-[1.01]'
        />
      </a>

      <a
        href={event.postUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground'
      >
        {meta.viewLabel}
        <ExternalLinkIcon />
      </a>
    </article>
  )
}

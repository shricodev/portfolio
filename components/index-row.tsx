import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRightIcon } from '@/components/icons'

// One numbered line in an index: used on the homepage and for blog picks.
export function IndexRow({
  number,
  href,
  title,
  summary,
  meta,
  mono,
}: {
  number: number
  href: string
  title: string
  summary?: string
  meta: ReactNode
  mono?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        className='group hover:bg-muted/60 -mx-3 flex gap-4 rounded-md px-3 py-3.5 transition-colors'
      >
        <span className='text-muted-foreground/70 pt-0.5 font-mono text-xs tabular-nums'>
          {String(number).padStart(2, '0')}
        </span>
        <span className='min-w-0 flex-1'>
          <span className='flex items-baseline justify-between gap-4'>
            <span
              className={
                mono
                  ? 'font-mono text-sm font-medium break-words'
                  : 'text-[15px] leading-snug font-medium'
              }
            >
              {title}
            </span>
            <span className='text-muted-foreground hidden shrink-0 font-mono text-xs sm:inline'>
              {meta}
            </span>
          </span>
          {summary && (
            <span className='text-muted-foreground mt-1 line-clamp-2 block text-sm leading-6'>
              {summary}
            </span>
          )}
          <span className='text-muted-foreground mt-1 block font-mono text-xs sm:hidden'>
            {meta}
          </span>
        </span>
        <ArrowUpRightIcon className='text-muted-foreground/0 group-hover:text-muted-foreground mt-0.5 size-4 shrink-0 transition-colors' />
      </Link>
    </li>
  )
}

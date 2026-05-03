'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  GitHubIcon,
  LinkedInIcon,
  RedditIcon,
  GmailIcon,
} from '@/components/icons'
import { InfoTooltip } from '@/components/info-tooltip'
import type { TocItem } from '@/lib/blogs/render'

const CONNECT_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/shricodev',
    icon: GitHubIcon,
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/iamshrijal',
    icon: LinkedInIcon,
    external: true,
  },
  {
    label: 'Reddit',
    href: 'https://www.reddit.com/user/shricodev',
    icon: RedditIcon,
    external: true,
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: GmailIcon,
    external: false,
  },
] as const

export function BlogToc({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const visibleIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (headings.length === 0) return

    const targets = headings
      .map(h => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    if (targets.length === 0) return

    const order = new Map(headings.map((h, i) => [h.id, i]))
    const visible = visibleIdsRef.current

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }

        if (visible.size > 0) {
          let firstId = ''
          let firstIdx = Number.POSITIVE_INFINITY
          for (const id of visible) {
            const idx = order.get(id) ?? Number.POSITIVE_INFINITY
            if (idx < firstIdx) {
              firstIdx = idx
              firstId = id
            }
          }
          if (firstId) setActiveId(firstId)
        }
      },
      { rootMargin: '-128px 0px -55% 0px', threshold: 0 },
    )

    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  const handleClick =
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      const el = document.getElementById(id)
      if (!el) return
      event.preventDefault()
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
      window.history.replaceState(null, '', `#${id}`)
      setActiveId(id)
    }

  if (headings.length === 0) return null

  return (
    <aside
      aria-label='Table of contents'
      className='scrollbar-none hidden xl:fixed xl:top-32 xl:left-[calc(50%+400px)] xl:block xl:w-56 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto'
    >
      <h2 className='mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
        On this page
      </h2>
      <nav>
        <ul className='space-y-2'>
          {headings.map(h => (
            <li
              key={h.id}
              style={{ paddingLeft: `${(h.depth - 2) * 12}px` }}
            >
              <a
                href={`#${h.id}`}
                onClick={handleClick(h.id)}
                aria-current={activeId === h.id ? 'true' : undefined}
                className={cn(
                  'block py-0.5 text-sm leading-snug hover:text-foreground',
                  activeId === h.id
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {h.value}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className='mt-8 border-t border-border pt-6'>
        <h2 className='mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          Connect
        </h2>
        <div className='flex items-center gap-5'>
          {CONNECT_LINKS.map(link => {
            const Icon = link.icon
            const className = 'text-muted-foreground hover:text-foreground'
            return (
              <InfoTooltip
                key={link.label}
                label={link.label}
                side='top'
                className='text-xs'
              >
                {link.external ? (
                  <a
                    href={link.href}
                    target='_blank'
                    rel='noreferrer noopener'
                    aria-label={link.label}
                    className={className}
                  >
                    <Icon className='size-5' />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    aria-label={link.label}
                    className={className}
                  >
                    <Icon className='size-5' />
                  </Link>
                )}
              </InfoTooltip>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

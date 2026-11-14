import Link from 'next/link'
import { ArrowUpRightIcon } from '@/components/icons'
import { BASE_URL } from '@/lib/constants'
import { WORK, type WorkLink } from '@/lib/work'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Where Shrijal Acharya has worked: developer advocacy at Composio, freelance engineering, technical writing for freeCodeCamp, and open-source leadership at Oppia.',
  alternates: {
    canonical: new URL('/work', BASE_URL).toString(),
  },
}

function RelatedLink({ link }: { link: WorkLink }) {
  const className =
    'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors'

  if (link.href.startsWith('/')) {
    return (
      <Link href={link.href} className={className}>
        {link.label}
      </Link>
    )
  }
  return (
    <a
      href={link.href}
      target='_blank'
      rel='noreferrer noopener'
      className={className}
    >
      {link.label}
      <ArrowUpRightIcon className='size-3' />
    </a>
  )
}

export default function Page() {
  return (
    <section>
      <h1 className='title'>Work</h1>
      <p className='lede'>
        Software engineering, developer advocacy, technical writing, and
        open-source leadership, across startups, foundations, and global
        programs. Each role links to what came out of it.
      </p>

      <ol className='mt-12'>
        {WORK.map(entry => (
          <li
            key={entry.org}
            className='border-border grid gap-x-8 gap-y-3 border-t py-8 sm:grid-cols-[9.5rem_1fr]'
          >
            <div className='text-muted-foreground font-mono text-xs leading-6'>
              <p>
                {entry.start} to {entry.end}
              </p>
              {entry.type && <p>{entry.type}</p>}
            </div>

            <article>
              <h2 className='text-lg leading-snug font-semibold tracking-tight'>
                {entry.role}
              </h2>
              <p className='text-muted-foreground mt-0.5 text-sm'>
                {entry.orgUrl ? (
                  <a
                    href={entry.orgUrl}
                    target='_blank'
                    rel='noreferrer noopener'
                    className='hover:text-foreground inline-flex items-center gap-0.5 underline underline-offset-4'
                  >
                    {entry.org}
                    <ArrowUpRightIcon className='size-3.5' />
                  </a>
                ) : (
                  entry.org
                )}
              </p>

              <p className='mt-4 leading-7'>{entry.summary}</p>

              {entry.highlights.length > 0 && (
                <ul className='text-muted-foreground marker:text-muted-foreground/50 mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-6'>
                  {entry.highlights.map(highlight => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}

              {entry.links && entry.links.length > 0 && (
                <div className='mt-5'>
                  <p className='eyebrow mb-2'>Related</p>
                  <ul className='flex flex-wrap gap-2'>
                    {entry.links.map(link => (
                      <li key={link.href}>
                        <RelatedLink link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}

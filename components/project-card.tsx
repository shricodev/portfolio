import Link from 'next/link'
import { ArrowUpRightIcon } from '@/components/icons'
import type { TProjectListItem } from '@/types/projects'

export function ProjectCard({ project }: { project: TProjectListItem }) {
  const { title, description, language, year, repo, homepage } = project

  return (
    <article className='border-border bg-card hover:border-foreground/25 relative flex h-full flex-col rounded-lg border p-5 transition-colors'>
      <div className='flex items-baseline justify-between gap-3'>
        <h3 className='min-w-0 font-mono text-sm font-medium break-words'>
          {/* stretched link, the whole card opens the project */}
          <Link
            href={`/projects/${title}`}
            className='after:absolute after:inset-0 after:rounded-lg'
          >
            {title}
          </Link>
        </h3>
        <span className='text-muted-foreground shrink-0 font-mono text-xs'>
          {year}
        </span>
      </div>

      <p className='text-muted-foreground mt-2 line-clamp-3 grow text-sm leading-6'>
        {description || 'No description yet.'}
      </p>

      <div className='text-muted-foreground mt-4 flex items-center justify-between gap-3 text-xs'>
        <span>{language}</span>
        <span className='relative z-10 flex items-center gap-4'>
          {homepage && (
            <a
              href={homepage}
              target='_blank'
              rel='noreferrer noopener'
              aria-label={`Live demo of ${title}`}
              className='hover:text-foreground inline-flex items-center gap-0.5'
            >
              Live
              <ArrowUpRightIcon className='size-3.5' />
            </a>
          )}
          <a
            href={repo}
            target='_blank'
            rel='noreferrer noopener'
            aria-label={`${title} on GitHub`}
            className='hover:text-foreground inline-flex items-center gap-0.5'
          >
            GitHub
            <ArrowUpRightIcon className='size-3.5' />
          </a>
        </span>
      </div>
    </article>
  )
}

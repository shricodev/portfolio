import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRightIcon } from '@/components/icons'
import { SOURCE_LABELS } from '@/components/post-row'
import { Tabs } from '@/components/tabs'
import { encodeSourceSlug } from '@/lib/blogs/slug'
import { formatCount, formatDate } from '@/lib/utils'
import type { TBlogCardMetadata } from '@/types/blogs'
import type { TProjectListItem } from '@/types/projects'

function IndexRow({
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

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='mt-6'>
      <p className='eyebrow mb-1'>{label}</p>
      <ol className='divide-border/60 divide-y'>{children}</ol>
    </div>
  )
}

function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className='text-muted-foreground hover:text-foreground mt-5 inline-block text-sm underline underline-offset-4'
    >
      {children}
    </Link>
  )
}

interface SelectedWorkProps {
  featuredProjects: TProjectListItem[]
  recentProjects: TProjectListItem[]
  projectCount: number
  popularPosts: TBlogCardMetadata[]
  recentPosts: TBlogCardMetadata[]
  postCount: number
}

export function SelectedWork({
  featuredProjects,
  recentProjects,
  projectCount,
  popularPosts,
  recentPosts,
  postCount,
}: SelectedWorkProps) {
  const projectRow = (project: TProjectListItem, index: number) => (
    <IndexRow
      key={project.title}
      number={index + 1}
      href={`/projects/${project.title}`}
      title={project.title}
      summary={project.description}
      meta={[project.language, project.year].filter(Boolean).join(' / ')}
      mono
    />
  )

  const postRow = (post: TBlogCardMetadata, index: number) => (
    <IndexRow
      key={`${post.source}_${post.slug}`}
      number={index + 1}
      href={`/blogs/${encodeSourceSlug(post.source, post.slug)}`}
      title={post.title}
      meta={[
        SOURCE_LABELS[post.source],
        formatDate(post.publishedAt, 'short'),
        post.reactionsCount > 0
          ? `${formatCount(post.reactionsCount)} reactions`
          : null,
      ]
        .filter(Boolean)
        .join(' / ')}
    />
  )

  const projects = (
    <>
      <Group label='Featured'>{featuredProjects.map(projectRow)}</Group>
      {recentProjects.length > 0 && (
        <Group label='Recently built'>
          {recentProjects.map((project, index) =>
            projectRow(project, featuredProjects.length + index),
          )}
        </Group>
      )}
      <MoreLink href='/projects'>All {projectCount} projects</MoreLink>
    </>
  )

  const writing =
    postCount === 0 ? (
      <p className='text-muted-foreground mt-6 text-sm'>
        Posts could not be loaded right now. They are all on the{' '}
        <Link href='/blogs' className='underline underline-offset-4'>
          blogs page
        </Link>
        .
      </p>
    ) : (
      <>
        <Group label='Most popular'>{popularPosts.map(postRow)}</Group>
        {recentPosts.length > 0 && (
          <Group label='Latest'>
            {recentPosts.map((post, index) =>
              postRow(post, popularPosts.length + index),
            )}
          </Group>
        )}
        <MoreLink href='/blogs'>All {postCount} posts</MoreLink>
      </>
    )

  return (
    <section aria-labelledby='selected-work' className='mt-20'>
      <h2 id='selected-work' className='text-xl font-semibold tracking-tight'>
        Selected work
      </h2>
      <p className='text-muted-foreground mt-1.5 mb-6 text-sm'>
        A short index of things I have built and written.
      </p>
      <Tabs
        label='Selected work'
        tabs={[
          { name: 'Projects', content: projects },
          { name: 'Writing', content: writing },
        ]}
      />
    </section>
  )
}

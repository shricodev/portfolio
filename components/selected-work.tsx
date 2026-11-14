import Link from 'next/link'
import type { ReactNode } from 'react'
import { IndexRow } from '@/components/index-row'
import { SOURCE_LABELS } from '@/components/post-row'
import { Tabs } from '@/components/tabs'
import { encodeSourceSlug } from '@/lib/blogs/slug'
import { formatCount, formatDate } from '@/lib/utils'
import type { TBlogCardMetadata } from '@/types/blogs'
import type { TProjectListItem } from '@/types/projects'

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
  pickedPosts: TBlogCardMetadata[]
  popularPosts: TBlogCardMetadata[]
  recentPosts: TBlogCardMetadata[]
  postCount: number
}

export function SelectedWork({
  featuredProjects,
  recentProjects,
  projectCount,
  pickedPosts,
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
        {pickedPosts.length > 0 && (
          <Group label='Personal favorites'>{pickedPosts.map(postRow)}</Group>
        )}
        {popularPosts.length > 0 && (
          <Group label='Popular'>
            {popularPosts.map((post, index) =>
              postRow(post, pickedPosts.length + index),
            )}
          </Group>
        )}
        {recentPosts.length > 0 && (
          <Group label='Newest'>
            {recentPosts.map((post, index) =>
              postRow(post, pickedPosts.length + popularPosts.length + index),
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

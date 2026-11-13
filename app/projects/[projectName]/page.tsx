import { BackLink } from '@/components/back-link'
import { ArrowUpRightIcon, GitHubIcon } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { BASE_URL } from '@/lib/constants'
import { renderMarkdown } from '@/lib/markdown/render'
import {
  getAllProjects,
  getProjectByTitle,
  toListItem,
} from '@/lib/projects'
import { formatDate, serializeJsonLd } from '@/lib/utils'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ projectName: string }>
}

// every project page is built ahead of time
export function generateStaticParams() {
  return getAllProjects().map(project => ({ projectName: project.title }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { projectName } = await props.params
  const project = getProjectByTitle(projectName)
  if (!project) return { title: 'Project not found' }

  const item = toListItem(project.metadata)
  const url = new URL(`/projects/${projectName}`, BASE_URL).toString()
  const meta = {
    title: item.title,
    description:
      item.description || `${item.title}, a project by Shrijal Acharya.`,
  }

  return {
    ...meta,
    alternates: { canonical: url },
    openGraph: { ...meta, url, type: 'article' },
    twitter: { ...meta, card: 'summary_large_image' },
  }
}

export default async function Page(props: Props) {
  const { projectName } = await props.params
  const project = getProjectByTitle(projectName)
  if (!project) notFound()

  const { metadata, content } = project
  const item = toListItem(metadata)
  const readme = content.trim()
    ? await renderMarkdown(content, { repo: projectName })
    : null

  const facts = [
    { label: 'Language', value: item.language },
    { label: 'Created', value: formatDate(metadata.created_at, 'short') },
    {
      label: 'Updated',
      value: metadata.updated_at
        ? formatDate(metadata.updated_at, 'short')
        : null,
    },
  ].filter(fact => fact.value)

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: item.title,
    description: item.description || undefined,
    url: new URL(`/projects/${projectName}`, BASE_URL).toString(),
    codeRepository: item.repo,
    programmingLanguage: item.language || undefined,
    keywords: item.topics.join(', ') || undefined,
    dateCreated: metadata.created_at,
    dateModified: metadata.updated_at,
    author: { '@type': 'Person', name: 'Shrijal Acharya', url: BASE_URL },
  }

  return (
    <section>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(projectJsonLd) }}
      />
      <BackLink href='/projects' label='All projects' />

      <header className='border-border mt-8 border-b pb-8'>
        <p className='eyebrow'>Project</p>
        <h1 className='mt-2 font-mono text-2xl font-semibold tracking-tight break-words sm:text-3xl'>
          {item.title}
        </h1>
        {item.description && (
          <p className='text-muted-foreground mt-3 max-w-2xl leading-7'>
            {item.description}
          </p>
        )}

        <div className='mt-6 flex flex-wrap gap-3'>
          <a
            href={item.repo}
            target='_blank'
            rel='noreferrer noopener'
            className={buttonVariants({ className: 'gap-2' })}
          >
            <GitHubIcon className='size-4' />
            View source
          </a>
          {item.homepage && (
            <a
              href={item.homepage}
              target='_blank'
              rel='noreferrer noopener'
              className={buttonVariants({
                variant: 'outline',
                className: 'gap-1.5',
              })}
            >
              Live demo
              <ArrowUpRightIcon className='size-4' />
            </a>
          )}
        </div>

        <dl className='mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3'>
          {facts.map(fact => (
            <div key={fact.label}>
              <dt className='eyebrow'>{fact.label}</dt>
              <dd className='mt-1 text-sm'>{fact.value}</dd>
            </div>
          ))}
        </dl>

        {item.topics.length > 0 && (
          <ul className='mt-6 flex flex-wrap gap-x-3 gap-y-1'>
            {item.topics.map(topic => (
              <li
                key={topic}
                className='text-muted-foreground font-mono text-xs'
              >
                #{topic}
              </li>
            ))}
          </ul>
        )}
      </header>

      {readme ? (
        <article className='prose mt-10 max-w-none'>{readme.content}</article>
      ) : (
        <p className='text-muted-foreground mt-10 text-sm'>
          This project has no README yet. The repository on GitHub has the
          details.
        </p>
      )}

      <p className='border-border text-muted-foreground mt-12 border-t pt-6 text-sm'>
        This page mirrors the README and may lag behind.{' '}
        <a
          href={item.repo}
          target='_blank'
          rel='noreferrer noopener'
          className='text-foreground underline underline-offset-4'
        >
          Read the latest on GitHub
        </a>
        .
      </p>
    </section>
  )
}

import { BackButton } from '@/components/back-button'
import { AlertIcon, ArrowLeftIcon, ArrowUpRightIcon } from '@/components/icons'
import MDXContent from '@/components/mdx-content'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { BASE_URL, PROJECT_FILTER_TOPIC } from '@/lib/constants'
import { getProjectByTitle, getProjectsMetadata } from '@/lib/projects'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface Props {
  params: Promise<{
    projectName: string
  }>
}

// Static Site Generation (SSG) to improve performance on static contents.
export async function generateStaticParams() {
  try {
    const projectsMetadata = getProjectsMetadata({ all: true })
    const projectSlugs = projectsMetadata.map(project => ({
      projectName: project.title,
    }))
    return projectSlugs
  } catch (error) {
    console.log('Error generating static params for projects:', error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { projectName } = await props.params
  const DEFAULT_METADATA = {
    title: projectName,
    description: 'A project by Shrijal Acharya showcasing work and skills.',
  } as const

  try {
    const project = getProjectByTitle({ title: projectName })

    if (!project) throw new Error(`Project not found: ${projectName}`)

    const { title, description } = project.metadata

    const baseMetadata = {
      title,
      description: description || DEFAULT_METADATA.description,
    }

    return {
      ...baseMetadata,
      openGraph: {
        ...baseMetadata,
        url: new URL(`/projects/${projectName}`, BASE_URL).toString(),
      },
      twitter: {
        ...baseMetadata,
        card: 'summary_large_image',
      },
    }
  } catch (error) {
    console.error(
      `Error generating dynamic metadata for project: ${projectName}: `,
      error,
    )

    return {
      ...DEFAULT_METADATA,
      openGraph: {
        ...DEFAULT_METADATA,
        url: new URL(`/projects/${projectName}`, BASE_URL).toString(),
      },
      twitter: {
        ...DEFAULT_METADATA,
        card: 'summary_large_image',
      },
    }
  }
}

export default async function Page(props: Props) {
  const { projectName } = await props.params
  try {
    const project = getProjectByTitle({ title: projectName })
    if (!project) notFound()

    const { metadata, content } = project

    const { title, author, clone_url, topics, created_at } = metadata

    const projectCreatedDate = formatDate({ date: created_at, short: true })

    return (
      <section className='pb-10'>
        <Suspense
          fallback={
            <Button disabled variant='secondary' className='mb-8 flex gap-2'>
              <ArrowLeftIcon className='size-5' />
              Back to projects
            </Button>
          }
        >
          <BackButton endpoint='projects' />
        </Suspense>

        <header>
          <Alert className='mb-8'>
            <AlertIcon className='size-5' />
            <AlertTitle className='text-sm font-semibold uppercase'>
              Heads up!
            </AlertTitle>
            <AlertDescription className='text-sm text-muted-foreground'>
              The README content here can be outdated. To read the latest
              version, visit my{' '}
              <a
                href='https://github.com/shricodev'
                target='_blank'
                rel='noreferrer noopener'
                className='font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground'
              >
                GitHub
              </a>{' '}
              profile.
            </AlertDescription>
          </Alert>

          <h1 className='flex items-center gap-2 text-3xl font-bold'>
            <a
              href={clone_url}
              target='_blank'
              rel='noreferrer noopener'
              className='hover:underline hover:underline-offset-4'
            >
              {title}
            </a>
          </h1>

          <div className='mt-3 flex items-center'>
            <Link href='/contact' className='flex items-center'>
              <UserAvatar className='size-8 sm:mr-2' />
              {author && (
                <span className='hidden text-sm font-semibold text-muted-foreground hover:underline hover:underline-offset-2 sm:inline'>
                  {author}
                </span>
              )}
            </Link>
            <span className='divider mx-1'>•</span>
            <a
              href={clone_url}
              target='_blank'
              rel='noreferrer noopener'
              className='flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:underline hover:underline-offset-2'
            >
              View on GitHub
            </a>
            <span className='divider mx-1'>•</span>
            {projectCreatedDate && (
              <span className='text-sm text-muted-foreground'>
                {projectCreatedDate}
              </span>
            )}
          </div>

          {topics && topics?.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {topics
                .filter(topic => topic !== PROJECT_FILTER_TOPIC)
                .map(topic => (
                  <Badge
                    key={topic}
                    className={badgeVariants({ variant: 'secondary' })}
                  >
                    {topic}
                  </Badge>
                ))}
            </div>
          )}
        </header>

        <main className='prose mt-12 max-w-3xl dark:prose-invert'>
          {content.trim().length > 0 ? (
            <MDXContent projectName={projectName} source={content} />
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 py-10 text-center'>
              <AlertIcon className='size-12 text-muted-foreground' />
              <div className='flex flex-col gap-4'>
                <h2 className='m-0 text-xl font-semibold'>No README Content</h2>
                <p className='text-muted-foreground'>
                  This project doesn&apos;t have a README file yet or the file
                  has no content. Check the GitHub repository for more
                  information.
                </p>
              </div>
            </div>
          )}
        </main>

        <div className='mt-10 flex items-center gap-1 text-sm font-medium text-muted-foreground'>
          <div className='flex items-center gap-1 hover:text-foreground hover:transition'>
            <ArrowUpRightIcon className='size-4' />
            <a href={clone_url} target='_blank' rel='noreferrer noopener'>
              GitHub
            </a>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error(`Error fetching project: ${projectName}`, error)
    notFound()
  }
}

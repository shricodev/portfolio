'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TProjectMetadata } from '@/types/projects'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { GitHubIcon } from '@/components/icons'
import { UserAvatar } from '@/components/user-avatar'
import { SEARCH_QUERY_PARAM } from '@/lib/constants'
import { useRouter } from 'next/navigation'

interface ProjectCardProps {
  projectMetadata: TProjectMetadata
  searchParams?: {
    [SEARCH_QUERY_PARAM]?: string
  }
}

export const ProjectCard = ({
  projectMetadata,
  searchParams,
}: ProjectCardProps) => {
  const router = useRouter()

  const {
    title,
    author,
    clone_url,
    homepage,
    description,
    language,
    created_at,
  } = projectMetadata

  const formattedCreatedDate = formatDate({ date: created_at, short: true })

  const handleBadgeClick = (language: string) => {
    const params = new URLSearchParams()
    params.set(SEARCH_QUERY_PARAM, language)
    router.push(`/projects?${params.toString()}`)
  }

  return (
    <Card className='w-full border-none bg-zinc-50 dark:bg-zinc-900'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between text-lg font-semibold'>
          <div className='flex items-center gap-2'>
            <Link
              href={{
                pathname: `/projects/${title}`,
                ...(searchParams?.[SEARCH_QUERY_PARAM]
                  ? {
                      query: {
                        [SEARCH_QUERY_PARAM]: searchParams[SEARCH_QUERY_PARAM],
                      },
                    }
                  : {}),
              }}
              className='hover:underline hover:underline-offset-4'
            >
              {title}
            </Link>
          </div>

          <span className='divider hidden text-sm font-light sm:inline'>
            {formattedCreatedDate}
          </span>
        </CardTitle>
        <CardDescription className='flex text-sm text-zinc-700 dark:text-zinc-400'>
          <div className='mt-3 flex items-center'>
            <Link href='/contact' className='flex items-center'>
              <UserAvatar className='mr-2 size-8' />
              {author ? (
                <span className='hidden font-semibold hover:underline hover:underline-offset-2 sm:inline'>
                  {author}
                </span>
              ) : null}
            </Link>

            <div className='flex items-center text-sm'>
              {language ? (
                <>
                  <span className='divider mr-1 sm:mx-1'>•</span>
                  <Badge
                    variant='secondary'
                    className='ml-1 cursor-pointer text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400'
                    onClick={() => handleBadgeClick(language)}
                  >
                    {language}
                  </Badge>
                </>
              ) : null}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      {description ? (
        <Link href={`/projects/${title}`}>
          <CardContent className='prose max-w-full text-zinc-700 dark:text-zinc-400'>
            {description}
          </CardContent>
        </Link>
      ) : null}
      <CardFooter className='flex justify-between'>
        <a
          href={clone_url}
          target='_blank'
          rel='noreferrer noopener'
          aria-label='View project on GitHub'
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <GitHubIcon className='size-5' />
          <span className='ml-1 hidden sm:inline'>GitHub</span>
        </a>

        {homepage ? (
          <a
            href={homepage}
            target='_blank'
            rel='noreferrer noopener'
            aria-label='View live demo of the project'
            className={buttonVariants({
              variant: 'default',
            })}
          >
            Live Demo
          </a>
        ) : null}
      </CardFooter>
    </Card>
  )
}

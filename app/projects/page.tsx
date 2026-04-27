import { fetchProjectsPage } from '@/app/projects/actions'
import { AlertIcon } from '@/components/icons'
import { ProjectsInfiniteList } from '@/components/projects-infinite-list'
import { Search } from '@/components/search'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  BASE_URL,
  DEBOUNCE_TIME_PROJECTS,
  PROJECTS_BATCH_SIZE,
  SEARCH_QUERY_PARAM,
} from '@/lib/constants'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Collection of my selected public repositories fetched through GitHub Actions.',
  alternates: {
    canonical: new URL('/projects', BASE_URL).toString(),
  },
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolved = await searchParams
  const rawQ = resolved?.[SEARCH_QUERY_PARAM]
  const rawSearchQuery = typeof rawQ === 'string' ? rawQ : undefined
  const searchQuery = rawSearchQuery?.trim() || undefined

  const perPage = PROJECTS_BATCH_SIZE
  const { items, hasMore, filteredCount, totalCount } = await fetchProjectsPage(
    {
      page: 1,
      perPage,
      q: searchQuery,
    },
  )

  const isFiltered = !!searchQuery
  const countLabel = isFiltered
    ? `Showing ${filteredCount} of ${totalCount} ${totalCount === 1 ? 'project' : 'projects'}`
    : `${totalCount} ${totalCount === 1 ? 'project' : 'projects'}`

  return (
    <section>
      <h1 className='title'>Projects</h1>
      <Alert className='mb-4'>
        <AlertIcon className='size-5' />
        <AlertTitle className='text-sm font-semibold uppercase'>
          Heads up!
        </AlertTitle>
        <AlertDescription className='text-muted-foreground text-sm'>
          It does not list all of my projects. To view them all, check out my{' '}
          <a
            href='https://github.com/shricodev'
            target='_blank'
            rel='noreferrer noopener'
            className='text-muted-foreground hover:text-foreground font-semibold underline underline-offset-4 hover:transition'
          >
            GitHub
          </a>{' '}
          profile.
        </AlertDescription>
      </Alert>

      <Suspense
        fallback={
          <Input
            disabled
            type='text'
            placeholder='Loading..'
            className='mb-4 h-9 w-full sm:w-1/2'
          />
        }
      >
        <Search
          query={rawSearchQuery}
          debounceTime={DEBOUNCE_TIME_PROJECTS}
          endpoint='projects'
          placeholder='Search projects by name or language...'
        />
      </Suspense>

      <p className='text-muted-foreground mb-4 text-sm'>{countLabel}</p>

      <ProjectsInfiniteList
        initialItems={items}
        initialHasMore={hasMore}
        perPage={perPage}
        searchQuery={searchQuery}
      />
    </section>
  )
}

import { AlertIcon, FilterIcon } from '@/components/icons'
import { PaginationControls } from '@/components/pagination-controls'
import { FilterDropdown } from '@/components/filter-dropdown'
import { Projects } from '@/components/projects'
import { Search } from '@/components/search'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  DEBOUNCE_TIME_PROJECTS,
  PAGE_QUERY_PARAM,
  PER_PAGE_QUERY_PARAM,
  PROJECTS_PER_PAGE_DEFAULT,
  SEARCH_QUERY_PARAM,
} from '@/lib/constants'
import { getProjectsCount, getProjectsMetadata } from '@/lib/projects'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseQueryParams } from '@/lib/query-params'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Collection of my selected public repositories fetched through GitHub Actions.',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const { perPageQuery, pageQuery, searchQuery } = parseQueryParams({
    searchParams: resolvedSearchParams,
    defaultPerPage: PROJECTS_PER_PAGE_DEFAULT,
    endpoint: 'projects',
  })

  const projectsMeta = searchQuery
    ? getProjectsMetadata({ all: true })
    : getProjectsMetadata({ page: pageQuery, perPage: perPageQuery })

  const filteredProjectsMeta = searchQuery
    ? projectsMeta.filter(
        projectMeta =>
          projectMeta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          projectMeta.language
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : projectsMeta

  const filteredProjectsLength = filteredProjectsMeta.length

  const projectsLength = searchQuery
    ? filteredProjectsLength
    : getProjectsCount()

  const totalPages = Math.max(Math.ceil(projectsLength / perPageQuery), 0)

  // Redirect if pageQuery exceeds totalPages
  if (totalPages > 0 && pageQuery > totalPages) {
    const params = new URLSearchParams(resolvedSearchParams as Record<string, string>)
    params.set(PAGE_QUERY_PARAM, String(totalPages))
    redirect(`/projects?${params.toString()}`)
  }

  // Paginate the filtered results
  const paginatedFilteredProjectsMeta = filteredProjectsMeta.slice(
    (pageQuery - 1) * perPageQuery,
    pageQuery * perPageQuery,
  )

  // Update the count displayed to the user
  const noOfPostsShownAlready =
    filteredProjectsLength === 0
      ? 0
      : searchQuery
        ? paginatedFilteredProjectsMeta.length + (pageQuery - 1) * perPageQuery
        : filteredProjectsLength + (pageQuery - 1) * perPageQuery

  return (
    <section>
      <h1 className='title'>Projects</h1>
      <Alert className='mb-4'>
        <AlertIcon className='size-5' />
        <AlertTitle className='text-sm font-semibold uppercase'>
          Heads up!
        </AlertTitle>
        <AlertDescription className='text-sm text-muted-foreground'>
          It does not list all of my projects. To view them all, check out my{' '}
          <a
            href='https://github.com/shricodev'
            target='_blank'
            rel='noreferrer noopener'
            className='font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground hover:transition'
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
          query={searchQuery}
          debounceTime={DEBOUNCE_TIME_PROJECTS}
          endpoint='projects'
          placeholder='Search projects by name or language...'
        />
      </Suspense>

      <Suspense
        fallback={
          <Button
            disabled
            variant='outline'
            className='flex items-center gap-1 text-zinc-700 dark:text-zinc-400'
          >
            Filter
            <FilterIcon className='size-4' />
          </Button>
        }
      >
        <FilterDropdown
          endpoint='projects'
          defaultPerPage={PROJECTS_PER_PAGE_DEFAULT}
        />
      </Suspense>

      <PaginationControls
        searchTerm={searchQuery}
        currentPage={pageQuery}
        totalPages={totalPages}
        perPage={perPageQuery}
        endpoint='projects'
      />

      <div className='mb-10 mt-5 flex justify-between text-sm font-medium text-muted-foreground'>
        <p>
          Showing {noOfPostsShownAlready} of{' '}
          {searchQuery ? filteredProjectsLength : projectsLength} projects
        </p>
        <p>
          Page {totalPages === 0 ? 0 : pageQuery} of {totalPages}
        </p>
      </div>

      <Projects
        projectsMeta={
          searchQuery ? paginatedFilteredProjectsMeta : projectsMeta
        }
        searchParams={{
          [SEARCH_QUERY_PARAM]: searchQuery,
          [PAGE_QUERY_PARAM]: pageQuery.toString(),
          [PER_PAGE_QUERY_PARAM]: perPageQuery.toString(),
        }}
      />
    </section>
  )
}

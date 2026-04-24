'use client'

import { useCallback, useMemo } from 'react'
import { fetchProjectsPage } from '@/app/projects/actions'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { useInfiniteScroll, type FetchPage } from '@/hooks/use-infinite-scroll'
import type { TProjectMetadata } from '@/types/projects'

interface ProjectsInfiniteListProps {
  initialItems: TProjectMetadata[]
  initialHasMore: boolean
  perPage: number
  searchQuery?: string
}

export const ProjectsInfiniteList = ({
  initialItems,
  initialHasMore,
  perPage,
  searchQuery,
}: ProjectsInfiniteListProps) => {
  const fetchPage = useCallback<FetchPage<TProjectMetadata>>(
    async ({ page, signal }) => {
      const result = await fetchProjectsPage({ page, perPage, q: searchQuery })
      if (signal.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }
      return { items: result.items, hasMore: result.hasMore }
    },
    [perPage, searchQuery],
  )

  const resetKey = useMemo(
    () => JSON.stringify({ q: searchQuery ?? '' }),
    [searchQuery],
  )

  const { items, isLoadingMore, hasMore, error, retry, sentinelRef } =
    useInfiniteScroll<TProjectMetadata>({
      initialItems,
      initialHasMore,
      fetchPage,
      resetKey,
    })

  const cardSearchParams = searchQuery ? { q: searchQuery } : undefined

  if (items.length === 0) {
    return (
      <p className='text-sm font-medium text-muted-foreground'>
        No results found
      </p>
    )
  }

  return (
    <>
      <ul className='flex flex-col gap-8'>
        {items.map(meta => (
          <li key={`${meta.title}_${meta.created_at}`}>
            <ProjectCard
              projectMetadata={meta}
              searchParams={cardSearchParams}
            />
          </li>
        ))}
      </ul>

      {hasMore && !error ? (
        <div ref={sentinelRef} aria-hidden='true' className='h-1' />
      ) : null}

      {isLoadingMore ? (
        <p
          role='status'
          aria-live='polite'
          className='mt-6 text-center text-sm text-muted-foreground'
        >
          Loading more…
        </p>
      ) : null}

      {error ? (
        <div
          role='alert'
          className='mt-6 flex flex-col items-center gap-2'
        >
          <p className='text-sm text-muted-foreground'>
            Something went wrong loading more projects.
          </p>
          <Button variant='outline' size='sm' onClick={retry}>
            Retry
          </Button>
        </div>
      ) : null}

      {!hasMore && !error ? (
        <p className='mt-6 text-center text-sm text-muted-foreground'>
          You&apos;ve reached the end.
        </p>
      ) : null}
    </>
  )
}

'use client'

import { useCallback, useMemo } from 'react'
import { fetchBlogsPage } from '@/app/blogs/actions'
import { BlogCard } from '@/components/blog-card'
import { Button } from '@/components/ui/button'
import { useInfiniteScroll, type FetchPage } from '@/hooks/use-infinite-scroll'
import type { BlogSourceFilter } from '@/lib/constants'
import type { TBlogCardMetadata } from '@/types/blogs'

interface BlogsInfiniteListProps {
  initialItems: TBlogCardMetadata[]
  initialHasMore: boolean
  perPage: number
  searchQuery?: string
  source: BlogSourceFilter
}

export const BlogsInfiniteList = ({
  initialItems,
  initialHasMore,
  perPage,
  searchQuery,
  source,
}: BlogsInfiniteListProps) => {
  const fetchPage = useCallback<FetchPage<TBlogCardMetadata>>(
    async ({ page, signal }) => {
      const result = await fetchBlogsPage({
        page,
        perPage,
        q: searchQuery,
        source,
      })
      if (signal.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }
      return { items: result.items, hasMore: result.hasMore }
    },
    [perPage, searchQuery, source],
  )

  const resetKey = useMemo(
    () => JSON.stringify({ q: searchQuery ?? '', source }),
    [searchQuery, source],
  )

  const { items, isLoadingMore, hasMore, error, retry, sentinelRef } =
    useInfiniteScroll<TBlogCardMetadata>({
      initialItems,
      initialHasMore,
      fetchPage,
      resetKey,
    })

  const cardSearchParams =
    searchQuery || source !== 'all'
      ? {
          ...(searchQuery ? { q: searchQuery } : {}),
          ...(source !== 'all' ? { source } : {}),
        }
      : undefined

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
          <li key={`${meta.source}_${meta.slug}`}>
            <BlogCard blogWithMeta={meta} searchParams={cardSearchParams} />
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
            Something went wrong loading more blogs.
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

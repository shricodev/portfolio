'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { TBlogCardMetadata } from '@/types/blogs'
import { PostRow } from '@/components/post-row'
import {
  EmptyState,
  SearchInput,
  Segmented,
  syncUrlParams,
} from '@/components/list-controls'
import { Button } from '@/components/ui/button'
import {
  BLOG_SOURCE_OPTIONS,
  LIST_BATCH_SIZE,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  SOURCE_QUERY_PARAM,
  type BlogSourceFilter,
} from '@/lib/constants'

type Sort = 'newest' | 'popular'

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'devto', label: 'DEV' },
  { value: 'freecodecamp', label: 'freeCodeCamp' },
] as const

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
] as const

interface BlogListProps {
  posts: TBlogCardMetadata[]
  initialQuery?: string
  initialSource?: BlogSourceFilter
  initialSort?: Sort
}

// The full post list is already on the page, so searching, filtering and
// sorting all happen right here with no requests.
export function BlogList({
  posts,
  initialQuery = '',
  initialSource = 'all',
  initialSort = 'newest',
}: BlogListProps) {
  const [query, setQuery] = useState(initialQuery)
  const [source, setSource] = useState<BlogSourceFilter>(initialSource)
  const [sort, setSort] = useState<Sort>(initialSort)
  const [visible, setVisible] = useState(LIST_BATCH_SIZE)

  const update = (next: {
    query?: string
    source?: BlogSourceFilter
    sort?: Sort
  }) => {
    const state = { query, source, sort, ...next }
    setQuery(state.query)
    setSource(state.source)
    setSort(state.sort)
    setVisible(LIST_BATCH_SIZE)
    syncUrlParams({
      [SEARCH_QUERY_PARAM]: state.query.trim() || undefined,
      [SOURCE_QUERY_PARAM]: state.source === 'all' ? undefined : state.source,
      [SORT_QUERY_PARAM]: state.sort === 'newest' ? undefined : state.sort,
    })
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matches = posts.filter(post => {
      if (source === 'devto' && post.source !== 'devto') return false
      if (source === 'freecodecamp' && post.source !== 'hashnode') return false
      if (!needle) return true
      return (
        post.title.toLowerCase().includes(needle) ||
        post.brief?.toLowerCase().includes(needle) ||
        post.tags?.some(tag => tag.name.toLowerCase().includes(needle))
      )
    })
    // posts arrive newest first
    return sort === 'popular'
      ? [...matches].sort((a, b) => b.reactionsCount - a.reactionsCount)
      : matches
  }, [posts, query, source, sort])

  const isFiltered = query.trim() !== '' || source !== 'all'

  return (
    <div>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <SearchInput
          value={query}
          onChange={value => update({ query: value })}
          placeholder='Search title, summary, or tag'
          label='Search blogs'
        />
        <div className='flex flex-wrap gap-2'>
          <Segmented
            label='Source'
            options={SOURCE_OPTIONS}
            value={source}
            onChange={value => update({ source: value })}
          />
          <Segmented
            label='Sort'
            options={SORT_OPTIONS}
            value={sort}
            onChange={value => update({ sort: value })}
          />
        </div>
      </div>

      <p
        className='text-muted-foreground mt-4 text-xs'
        role='status'
        aria-live='polite'
      >
        {isFiltered
          ? `${filtered.length} of ${posts.length} posts`
          : `${posts.length} posts`}
      </p>

      {filtered.length === 0 ? (
        <div className='mt-6'>
          <EmptyState
            title={
              posts.length === 0
                ? 'Posts could not be loaded right now.'
                : 'No posts match those filters.'
            }
            onReset={() => update({ query: '', source: 'all' })}
          />
        </div>
      ) : (
        <ul className='divide-border mt-2 divide-y'>
          {filtered.slice(0, visible).map(post => (
            <li key={`${post.source}_${post.slug}`}>
              <PostRow post={post} onTagClick={tag => update({ query: tag })} />
            </li>
          ))}
        </ul>
      )}

      {filtered.length > visible && (
        <div className='mt-6 flex justify-center'>
          <Button
            variant='outline'
            onClick={() => setVisible(count => count + LIST_BATCH_SIZE)}
          >
            Show more ({filtered.length - visible} left)
          </Button>
        </div>
      )}
    </div>
  )
}

function isSource(value: string | null): value is BlogSourceFilter {
  return BLOG_SOURCE_OPTIONS.includes(value as BlogSourceFilter)
}

// Reads filters from a shared link. Rendered inside Suspense so the page
// itself stays static.
export function BlogListFromUrl({ posts }: { posts: TBlogCardMetadata[] }) {
  const params = useSearchParams()
  const source = params.get(SOURCE_QUERY_PARAM)
  return (
    <BlogList
      posts={posts}
      initialQuery={params.get(SEARCH_QUERY_PARAM) ?? ''}
      initialSource={isSource(source) ? source : 'all'}
      initialSort={
        params.get(SORT_QUERY_PARAM) === 'popular' ? 'popular' : 'newest'
      }
    />
  )
}

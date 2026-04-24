import { fetchBlogsPage } from '@/app/blogs/actions'
import { BlogsInfiniteList } from '@/components/blogs-infinite-list'
import { AlertIcon } from '@/components/icons'
import { Search } from '@/components/search'
import { SourceFilter } from '@/components/source-filter'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  BASE_URL,
  BLOGS_BATCH_SIZE,
  BLOG_SOURCE_OPTIONS,
  DEBOUNCE_TIME_BLOGS,
  SEARCH_QUERY_PARAM,
  SOURCE_QUERY_PARAM,
  type BlogSourceFilter,
} from '@/lib/constants'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Explore my collection of blog posts from DEV and freeCodeCamp, where I share my ideas on coding, DevOps, cloud and more.',
  alternates: {
    canonical: new URL('/blogs', BASE_URL).toString(),
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

  const rawSource = resolved?.[SOURCE_QUERY_PARAM]
  const source: BlogSourceFilter =
    typeof rawSource === 'string' &&
    BLOG_SOURCE_OPTIONS.includes(rawSource as BlogSourceFilter)
      ? (rawSource as BlogSourceFilter)
      : 'all'

  const perPage = BLOGS_BATCH_SIZE
  const { items, hasMore, filteredCount, totalCount } = await fetchBlogsPage({
    page: 1,
    perPage,
    q: searchQuery,
    source,
  })

  const isFiltered = !!searchQuery || source !== 'all'
  const countLabel = isFiltered
    ? `Showing ${filteredCount} of ${totalCount} ${totalCount === 1 ? 'blog' : 'blogs'}`
    : `${totalCount} ${totalCount === 1 ? 'blog' : 'blogs'}`

  return (
    <section>
      <h1 className='title'>Blogs</h1>
      <Alert className='mb-4'>
        <AlertIcon className='size-5' />
        <AlertTitle className='text-sm font-semibold uppercase'>
          Heads up!
        </AlertTitle>
        <AlertDescription className='text-sm text-muted-foreground'>
          These posts are aggregated from{' '}
          <a
            href='https://dev.to/shricodev'
            target='_blank'
            rel='noreferrer noopener'
            className='font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground hover:transition'
          >
            DEV
          </a>{' '}
          and{' '}
          <a
            href='https://freecodecamp.org/news/author/shricodev'
            target='_blank'
            rel='noreferrer noopener'
            className='font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground hover:transition'
          >
            freeCodeCamp
          </a>
          . Visit them for full engagement.
        </AlertDescription>
      </Alert>

      <Suspense
        fallback={
          <Input
            disabled
            type='text'
            placeholder='Loading...'
            className='mb-4 h-9 w-full sm:w-1/2'
          />
        }
      >
        <Search
          query={rawSearchQuery}
          endpoint='blogs'
          debounceTime={DEBOUNCE_TIME_BLOGS}
          placeholder='Search blogs by title or tags...'
        />
      </Suspense>

      <Suspense fallback={null}>
        <SourceFilter current={source} />
      </Suspense>

      <p className='mb-4 text-sm text-muted-foreground'>{countLabel}</p>

      <BlogsInfiniteList
        initialItems={items}
        initialHasMore={hasMore}
        perPage={perPage}
        searchQuery={searchQuery}
        source={source}
      />
    </section>
  )
}

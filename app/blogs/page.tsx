import { Blogs } from '@/components/blogs'
import { AlertIcon, FilterIcon } from '@/components/icons'
import { PaginationControls } from '@/components/pagination-controls'
import { Search } from '@/components/search'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  BLOGS_PER_PAGE_DEFAULT,
  DEBOUNCE_TIME_BLOGS,
  PAGE_QUERY_PARAM,
  PER_PAGE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
} from '@/lib/constants'
import { getBlogPostsCardMeta } from '@/lib/blogs'
import type { Metadata } from 'next'
import { getBlogPostsCount } from '@/lib/blogs'
import { FilterDropdown } from '@/components/filter-dropdown'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseQueryParams } from '@/lib/query-params'

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Explore my collection of blog posts, where I share my ideas on coding, DevOps, cloud and more, powered by Hashnode Headless CMS.',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const { perPageQuery, pageQuery, searchQuery } = parseQueryParams({
    searchParams: resolvedSearchParams,
    defaultPerPage: BLOGS_PER_PAGE_DEFAULT,
    endpoint: 'blogs',
  })

  const { blogs } = searchQuery
    ? await getBlogPostsCardMeta({ all: true })
    : await getBlogPostsCardMeta({ page: pageQuery, pageSize: perPageQuery })

  const filteredBlogs = searchQuery
    ? {
        blogs: blogs.filter(
          blog =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.tags?.some(tag =>
              tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        ),
      }
    : { blogs }

  const filteredBlogsLength = filteredBlogs.blogs.length

  const blogslength = searchQuery
    ? filteredBlogsLength
    : await getBlogPostsCount()

  const totalPages = Math.max(Math.ceil(blogslength / perPageQuery), 0)

  if (totalPages > 0 && pageQuery > totalPages) {
    const params = new URLSearchParams(resolvedSearchParams as Record<string, string>)
    params.set(PAGE_QUERY_PARAM, String(totalPages))
    redirect(`/blogs?${params.toString()}`)
  }

  const paginatedFilteredBlogs = filteredBlogs.blogs.slice(
    (pageQuery - 1) * perPageQuery,
    pageQuery * perPageQuery,
  )

  const noOfBlogsShownAlready =
    filteredBlogsLength === 0
      ? 0
      : searchQuery
        ? paginatedFilteredBlogs.length + (pageQuery - 1) * perPageQuery
        : filteredBlogsLength + (pageQuery - 1) * perPageQuery

  return (
    <section>
      <h1 className='title'>Blogs</h1>
      <Alert className='mb-4'>
        <AlertIcon className='size-5' />
        <AlertTitle className='text-sm font-semibold uppercase'>
          Heads up!
        </AlertTitle>
        <AlertDescription className='text-sm text-muted-foreground'>
          Check out these posts on{' '}
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
            href='https://shricodev.hashnode.dev'
            target='_blank'
            rel='noreferrer noopener'
            className='font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground hover:transition'
          >
            Hashnode
          </a>{' '}
          for full engagement.
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
          query={searchQuery}
          endpoint='blogs'
          debounceTime={DEBOUNCE_TIME_BLOGS}
          placeholder='Search blogs by title or tags...'
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
          endpoint='blogs'
          defaultPerPage={BLOGS_PER_PAGE_DEFAULT}
        />
      </Suspense>

      <PaginationControls
        searchTerm={searchQuery}
        currentPage={pageQuery}
        totalPages={totalPages}
        perPage={perPageQuery}
        endpoint='blogs'
      />

      <div className='mb-10 mt-5 flex justify-between text-sm font-medium text-muted-foreground'>
        <p>
          Showing {noOfBlogsShownAlready} of{' '}
          {searchQuery ? filteredBlogsLength : blogslength} blogs
        </p>
        <p>
          Page {totalPages === 0 ? 0 : pageQuery} of {totalPages}
        </p>
      </div>

      <Blogs
        blogsWithMeta={searchQuery ? paginatedFilteredBlogs : blogs}
        searchParams={{
          [SEARCH_QUERY_PARAM]: searchQuery,
          [PAGE_QUERY_PARAM]: pageQuery.toString(),
          [PER_PAGE_QUERY_PARAM]: perPageQuery.toString(),
        }}
      />
    </section>
  )
}

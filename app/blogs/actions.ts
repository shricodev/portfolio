'use server'

import { getBlogPostsCardMeta, getBlogPostsCount } from '@/lib/blogs'
import type { BlogSourceFilter } from '@/lib/constants'
import type { TBlogCardMetadata } from '@/types/blogs'

export interface FetchBlogsResult {
  items: TBlogCardMetadata[]
  hasMore: boolean
  filteredCount: number
  totalCount: number
}

export async function fetchBlogsPage({
  page,
  perPage,
  q,
  source,
}: {
  page: number
  perPage: number
  q?: string
  source: BlogSourceFilter
}): Promise<FetchBlogsResult> {
  const trimmed = q?.trim().toLowerCase()
  const needsAllPosts = !!trimmed || source !== 'all'

  if (!needsAllPosts) {
    const [{ blogs }, totalCount] = await Promise.all([
      getBlogPostsCardMeta({ page, pageSize: perPage }),
      getBlogPostsCount(),
    ])
    return {
      items: blogs,
      hasMore: page * perPage < totalCount,
      filteredCount: totalCount,
      totalCount,
    }
  }

  const { blogs: allBlogs } = await getBlogPostsCardMeta({ all: true })
  const totalCount = allBlogs.length

  const sourceFiltered =
    source === 'all'
      ? allBlogs
      : allBlogs.filter(blog =>
          source === 'devto' ? blog.source === 'devto' : blog.source === 'hashnode',
        )

  const searchFiltered = trimmed
    ? sourceFiltered.filter(
        blog =>
          blog.title.toLowerCase().includes(trimmed) ||
          blog.tags?.some(tag => tag.name.toLowerCase().includes(trimmed)),
      )
    : sourceFiltered

  const filteredCount = searchFiltered.length
  const start = (page - 1) * perPage
  return {
    items: searchFiltered.slice(start, start + perPage),
    hasMore: page * perPage < filteredCount,
    filteredCount,
    totalCount,
  }
}

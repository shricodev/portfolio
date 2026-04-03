import { BLOG_SOURCE_PREFIX_SEPARATOR } from '@/lib/constants'
import type {
  BlogSource,
  TBlogCardMetadata,
  TBlogPostDetail,
} from '@/types/blogs'
import { getAllDevtoPosts, getDevtoPostBySlug } from './devto'
import {
  getAllHashnodeFCCPosts,
  getHashnodeFCCPostBySlug,
  subscribeToNewsletter,
} from './hashnode'

// Re-export newsletter for backward compat
export { subscribeToNewsletter }

/**
 * Encode source + slug into a URL-safe slug with a source prefix.
 * e.g. "devto--my-post-slug" or "hashnode--my-post-slug"
 */
export function encodeSourceSlug(source: BlogSource, slug: string): string {
  return `${source}${BLOG_SOURCE_PREFIX_SEPARATOR}${slug}`
}

/**
 * Decode a prefixed slug back to { source, slug }.
 * Falls back to 'devto' if no prefix found.
 */
export function decodeSourceSlug(prefixedSlug: string): {
  source: BlogSource
  slug: string
} {
  const sepIndex = prefixedSlug.indexOf(BLOG_SOURCE_PREFIX_SEPARATOR)
  if (sepIndex === -1) {
    return { source: 'devto', slug: prefixedSlug }
  }

  const source = prefixedSlug.substring(0, sepIndex) as BlogSource
  const slug = prefixedSlug.substring(
    sepIndex + BLOG_SOURCE_PREFIX_SEPARATOR.length,
  )

  if (source !== 'devto' && source !== 'hashnode') {
    return { source: 'devto', slug: prefixedSlug }
  }

  return { source, slug }
}

function sortByPublishedAtDesc(a: TBlogCardMetadata, b: TBlogCardMetadata) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
}

/**
 * Fetch all blog posts from both sources, merge, and sort by date.
 */
export async function getAllBlogPosts(): Promise<TBlogCardMetadata[]> {
  const [devtoPosts, hashnodePosts] = await Promise.allSettled([
    getAllDevtoPosts(),
    getAllHashnodeFCCPosts(),
  ])

  const merged: TBlogCardMetadata[] = []

  if (devtoPosts.status === 'fulfilled') {
    merged.push(...devtoPosts.value)
  } else {
    console.error('Failed to fetch Dev.to posts:', devtoPosts.reason)
  }

  if (hashnodePosts.status === 'fulfilled') {
    merged.push(...hashnodePosts.value)
  } else {
    console.error('Failed to fetch Hashnode FCC posts:', hashnodePosts.reason)
  }

  return merged.sort(sortByPublishedAtDesc)
}

/**
 * Get a paginated slice of all blog posts (merged from both sources).
 * When `all` is true, returns everything. Otherwise returns a single page.
 */
export async function getBlogPostsCardMeta({
  pageSize = 5,
  page = 1,
  all = false,
}: {
  pageSize?: number
  page?: number
  all?: boolean
}): Promise<{ blogs: TBlogCardMetadata[] }> {
  const allPosts = await getAllBlogPosts()

  if (all) {
    return { blogs: allPosts }
  }

  const start = (page - 1) * pageSize
  return { blogs: allPosts.slice(start, start + pageSize) }
}

/**
 * Total count across both sources.
 */
export async function getBlogPostsCount(): Promise<number> {
  const allPosts = await getAllBlogPosts()
  return allPosts.length
}

/**
 * All slugs for generateStaticParams — includes source prefix.
 */
export async function getAllBlogPostSlugs(): Promise<{ slug: string }[]> {
  const allPosts = await getAllBlogPosts()
  return allPosts.map(post => ({
    slug: encodeSourceSlug(post.source, post.slug),
  }))
}

/**
 * Fetch a single blog post by its source-prefixed slug.
 */
export async function getBlogPostBySlug(
  prefixedSlug: string,
): Promise<TBlogPostDetail | null> {
  const { source, slug } = decodeSourceSlug(prefixedSlug)

  if (source === 'devto') {
    return getDevtoPostBySlug(slug)
  }

  return getHashnodeFCCPostBySlug(slug)
}

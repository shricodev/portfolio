import type { TBlogCardMetadata, TBlogPostDetail } from '@/types/blogs'
import { getAllDevtoPosts, getDevtoPostBySlug } from './devto'
import {
  getAllHashnodeFCCPosts,
  getHashnodeFCCPostBySlug,
} from './hashnode'
import { decodeSourceSlug, encodeSourceSlug } from './slug'

export { decodeSourceSlug, encodeSourceSlug }

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
 * All slugs for generateStaticParams (includes source prefix).
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

/**
 * Resolve a single post's card metadata from the cached merged list.
 * Used by `generateMetadata` so we don't make a per-slug API call for
 * every static page during build (which was causing 429s on Dev.to).
 */
export async function getBlogPostCardBySlug(
  prefixedSlug: string,
): Promise<TBlogCardMetadata | null> {
  const { source, slug } = decodeSourceSlug(prefixedSlug)
  const all = await getAllBlogPosts()
  return all.find(p => p.source === source && p.slug === slug) ?? null
}

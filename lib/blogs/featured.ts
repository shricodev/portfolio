import { FEATURED_POSTS } from '@/lib/constants'
import { encodeSourceSlug } from '@/lib/blogs/slug'
import type { TBlogCardMetadata } from '@/types/blogs'

// Hand-picked posts in the order they're listed. Anything that no longer
// exists upstream is skipped quietly.
export function getFeaturedPosts(
  posts: TBlogCardMetadata[],
): TBlogCardMetadata[] {
  const bySlug = new Map(
    posts.map(post => [encodeSourceSlug(post.source, post.slug), post]),
  )
  return FEATURED_POSTS.map(slug => bySlug.get(slug)).filter(
    (post): post is TBlogCardMetadata => post !== undefined,
  )
}

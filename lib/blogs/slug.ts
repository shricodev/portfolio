import { BLOG_SOURCE_PREFIX_SEPARATOR } from '@/lib/constants'
import type { BlogSource } from '@/types/blogs'

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

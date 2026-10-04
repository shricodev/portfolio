import { describe, expect, test } from 'bun:test'
import { decodeSourceSlug, encodeSourceSlug } from '@/lib/blogs/slug'

describe('blog source slugs', () => {
  test('round-trips supported sources', () => {
    const encoded = encodeSourceSlug('hashnode', 'durable-agents')
    expect(decodeSourceSlug(encoded)).toEqual({
      source: 'hashnode',
      slug: 'durable-agents',
    })
  })

  test('keeps legacy unprefixed slugs on DEV', () => {
    expect(decodeSourceSlug('legacy-post')).toEqual({
      source: 'devto',
      slug: 'legacy-post',
    })
  })
})

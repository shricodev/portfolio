import { describe, expect, test } from 'bun:test'
import nextConfig from '@/next.config'

describe('Next.js site configuration', () => {
  test('redirects every legacy feed URL to the canonical feed', async () => {
    const redirects = await nextConfig.redirects?.()
    expect(redirects).toHaveLength(5)
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: '/feed.xml',
          destination: '/rss.xml',
          permanent: true,
        }),
      ]),
    )
  })

  test('adds baseline browser security headers', async () => {
    const rules = await nextConfig.headers?.()
    const keys = new Set(
      rules?.flatMap(rule => rule.headers.map(header => header.key)),
    )

    expect(keys.has('Content-Security-Policy-Report-Only')).toBe(true)
    expect(keys.has('Referrer-Policy')).toBe(true)
    expect(keys.has('X-Content-Type-Options')).toBe(true)
    expect(keys.has('X-Frame-Options')).toBe(true)
    expect(keys.has('Permissions-Policy')).toBe(true)
  })
})

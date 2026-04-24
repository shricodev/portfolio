import { BASE_URL } from '@/lib/constants'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // We don't want to  completely disallow crawlers in the privacy page.
        // We don't want them to index the page, but want them to follow any links
        // on the page. This is handled in the privacy page itself.
        //disallow: ['/privacy'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

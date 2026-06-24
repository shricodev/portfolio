import { BASE_URL } from '@/lib/constants'
import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.url
  if (
    url.endsWith('/feed.xml') ||
    url.endsWith('/rss') ||
    url.endsWith('/rss2') ||
    url.endsWith('/rss2.xml') ||
    url.endsWith('/feed')
  ) {
    return NextResponse.redirect(new URL('/rss.xml', BASE_URL).toString(), 308)
  }

  return NextResponse.next()
}

// Only run on the RSS aliases. Without a matcher the proxy runs on every
// request, which makes usePathname unreliable on statically prerendered
// pages (e.g. the navbar's active "Home" link on first load).
export const config = {
  matcher: ['/feed', '/feed.xml', '/rss', '/rss2', '/rss2.xml'],
}

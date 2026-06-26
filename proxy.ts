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

// Only run on the RSS aliases so the redirect doesn't fire on every request.
// Note: this file existing at all makes Next defer usePathname() on static
// pages, which is why the navbar reads it after mount (see useActivePathname).
export const config = {
  matcher: ['/feed', '/feed.xml', '/rss', '/rss2', '/rss2.xml'],
}

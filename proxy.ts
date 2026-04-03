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

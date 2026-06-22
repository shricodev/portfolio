import { XMLParser } from 'fast-xml-parser'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { FREECODECAMP_RSS_URL } from '@/lib/constants'
import type { TBlogCardMetadata, TBlogPostDetail } from '@/types/blogs'
import { probeCoverDimensions } from '@/lib/blogs/probe-cover'

// freeCodeCamp posts used to come from Hashnode's GraphQL API, but that went
// Pro-only, so they now come from the FCC author RSS feed instead. The source
// key stays 'hashnode' so existing /blogs/hashnode--* URLs keep working.

type TRssItem = {
  title?: string
  description?: string
  link?: string
  guid?: string | { '#text'?: string }
  category?: string | string[]
  'dc:creator'?: string
  pubDate?: string
  'media:content'?: { '@_url'?: string } | { '@_url'?: string }[]
  'content:encoded'?: string
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
})

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

// FCC URLs look like https://www.freecodecamp.org/news/<slug>/ — use the last
// path segment as the slug.
function slugFromLink(link: string): string {
  return (
    link
      .replace(/\/+$/, '')
      .split('/')
      .pop() ?? ''
  )
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

async function fetchRssItems(): Promise<TRssItem[]> {
  const res = await fetch(FREECODECAMP_RSS_URL, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) {
    console.error('Failed to fetch freeCodeCamp RSS feed:', res.status)
    return []
  }
  const xml = await res.text()
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: TRssItem | TRssItem[] } }
  }
  return toArray(parsed.rss?.channel?.item)
}

function itemToCardMetadata(item: TRssItem): TBlogCardMetadata | null {
  const link = text(item.link)
  if (!link) return null

  const slug = slugFromLink(link)
  if (!slug) return null

  const guid = typeof item.guid === 'string' ? item.guid : item.guid?.['#text']
  const coverImage = text(toArray(item['media:content'])[0]?.['@_url']) || undefined
  const brief = text(item.description) || undefined
  const tags = toArray(item.category)
    .map(c => text(c).replace(/^#/, '').trim())
    .filter(Boolean)
    .map(name => ({ name }))

  // Strip tags for a rough word count; the feed gives full content per item.
  const plainText = text(item['content:encoded']).replace(/<[^>]+>/g, ' ')

  const published = new Date(text(item.pubDate))
  const publishedAt = Number.isNaN(published.getTime())
    ? new Date(0).toISOString()
    : published.toISOString()

  return {
    id: guid || slug,
    title: text(item.title),
    readTimeInMinutes: estimateReadTime(plainText),
    brief,
    publishedAt,
    slug,
    tags,
    author: { name: text(item['dc:creator']) || 'Shrijal Acharya' },
    source: 'hashnode',
    sourceUrl: link,
    coverImage,
    commentsCount: 0,
    reactionsCount: 0,
    seo: brief ? { description: brief } : undefined,
  }
}

export async function getAllHashnodeFCCPosts(): Promise<TBlogCardMetadata[]> {
  const items = await fetchRssItems()
  const cards = items
    .map(itemToCardMetadata)
    .filter((c): c is TBlogCardMetadata => c !== null)

  return Promise.all(
    cards.map(async card => {
      const dims = await probeCoverDimensions(card.coverImage)
      return {
        ...card,
        coverImageWidth: dims?.width,
        coverImageHeight: dims?.height,
      }
    }),
  )
}

export async function getHashnodeFCCPostBySlug(
  slug: string,
): Promise<TBlogPostDetail | null> {
  try {
    const items = await fetchRssItems()
    const item = items.find(i => slugFromLink(text(i.link)) === slug)
    if (!item) return null

    const card = itemToCardMetadata(item)
    if (!card) return null

    // Hashnode marks code blocks with a `lang-*` class, but rehype-pretty-code
    // expects `language-*`, so normalize the prefix or the language (and its
    // highlighting) gets dropped.
    const html = text(item['content:encoded']).replace(
      /(<code\b[^>]*\bclass=")lang-/gi,
      '$1language-',
    )
    const markdown = html ? NodeHtmlMarkdown.translate(html) : ''
    const dims = await probeCoverDimensions(card.coverImage)

    return {
      ...card,
      coverImageWidth: dims?.width,
      coverImageHeight: dims?.height,
      content: { markdown },
    }
  } catch (error) {
    console.error(`Failed to fetch freeCodeCamp post by slug: ${slug}`, error)
    return null
  }
}

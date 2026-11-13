import {
  DEVTO_API_BASE,
  DEVTO_BLOGS_PER_PAGE,
  DEVTO_USERNAME,
} from '@/lib/constants'
import type {
  TDevtoArticle,
  TDevtoArticleDetail,
  TBlogCardMetadata,
  TBlogPostDetail,
} from '@/types/blogs'
import { createLimiter } from '@/lib/blogs/limit'
import { cache } from 'react'

// Dev.to rate-limits unauthenticated traffic per IP. Cap concurrent
// in-flight calls per worker process so static generation does not
// burst past the limit and trigger 429s.
const devtoLimit = createLimiter(2)

const DEVTO_REQUEST_TIMEOUT_MS = 10_000

async function waitForRetry(
  retryAfter: string | null,
  attempt: number,
): Promise<void> {
  const parsedRetryAfter = retryAfter
    ? Number.parseInt(retryAfter, 10) * 1000
    : Number.NaN
  const base = Number.isFinite(parsedRetryAfter)
    ? Math.max(1000, parsedRetryAfter)
    : Math.min(Math.pow(2, attempt) * 1000, 10_000)
  const delay = base + Math.random() * base * 0.25
  await new Promise(resolve => setTimeout(resolve, delay))
}

async function fetchDevto<T>(path: string, retries = 4): Promise<T> {
  return devtoLimit(async () => {
    let lastError: unknown

    for (let attempt = 0; attempt < retries; attempt++) {
      let res: Response
      try {
        res = await fetch(`${DEVTO_API_BASE}${path}`, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(DEVTO_REQUEST_TIMEOUT_MS),
        })
      } catch (error) {
        lastError = error
        if (attempt === retries - 1) break
        await waitForRetry(null, attempt)
        continue
      }

      const retryable = res.status === 429 || res.status >= 500
      if (retryable && attempt < retries - 1) {
        await waitForRetry(res.headers.get('retry-after'), attempt)
        continue
      }

      if (!res.ok) {
        throw new Error(`Dev.to API error: ${res.status} ${res.statusText}`)
      }

      return res.json() as Promise<T>
    }

    throw lastError instanceof Error
      ? lastError
      : new Error('Dev.to API: max retries exceeded')
  })
}

function normalizeDevtoArticle(article: TDevtoArticle): TBlogCardMetadata {
  const coverImage = article.cover_image ?? undefined
  return {
    id: String(article.id),
    title: article.title,
    readTimeInMinutes: article.reading_time_minutes,
    brief: article.description,
    publishedAt: article.published_at,
    updatedAt: article.edited_at ?? undefined,
    slug: article.slug,
    tags: (Array.isArray(article.tag_list)
      ? article.tag_list
      : typeof article.tag_list === 'string'
        ? (article.tag_list as string)
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)
        : []
    ).map(name => ({ name })),
    author: { name: article.user.name },
    source: 'devto',
    sourceUrl: article.url,
    coverImage,
    commentsCount: article.comments_count,
    reactionsCount: article.public_reactions_count,
    organization: article.organization
      ? {
          name: article.organization.name,
          username: article.organization.username,
          profileImage: article.organization.profile_image,
        }
      : undefined,
  }
}

export async function getDevtoPosts(
  page = 1,
  perPage = DEVTO_BLOGS_PER_PAGE,
): Promise<TBlogCardMetadata[]> {
  const articles = await fetchDevto<TDevtoArticle[]>(
    `/articles?username=${DEVTO_USERNAME}&per_page=${perPage}&page=${page}`,
  )
  return articles.map(normalizeDevtoArticle)
}

// Deduped per render with React cache. Across renders the fetch data cache
// (revalidate above) does the work, so this never goes stale in a long-lived
// server the way a module-level variable would.
export const getAllDevtoPosts = cache(
  async (): Promise<TBlogCardMetadata[]> => {
    const allPosts: TBlogCardMetadata[] = []
    let page = 1

    while (true) {
      const posts = await getDevtoPosts(page, DEVTO_BLOGS_PER_PAGE)
      allPosts.push(...posts)
      if (posts.length < DEVTO_BLOGS_PER_PAGE) break
      page++
    }

    return allPosts
  },
)

// Returns null only when the post doesn't exist. API failures throw, so an
// ISR revalidation keeps serving the last good page instead of caching a 404.
export async function getDevtoPostBySlug(
  slug: string,
): Promise<TBlogPostDetail | null> {
  // Org posts live under the org's username, so resolve the slug to an id
  // through the list first, then fetch the full body by id.
  const allPosts = await getAllDevtoPosts()
  const match = allPosts.find(p => p.slug === slug)
  if (!match) return null

  const article = await fetchDevto<TDevtoArticleDetail>(`/articles/${match.id}`)

  return {
    ...normalizeDevtoArticle(article),
    content: {
      markdown: article.body_markdown,
      html: article.body_html,
    },
  }
}

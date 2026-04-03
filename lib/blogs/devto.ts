import {
  DEVTO_API_BASE,
  DEVTO_BLOGS_PER_PAGE,
  DEVTO_USERNAME,
} from '@/lib/constants'
import type {
  TDevtoArticle,
  TDevtoArticleDetail,
  TDevtoComment,
  TBlogCardMetadata,
  TBlogPostDetail,
  TBlogComment,
} from '@/types/blogs'

async function fetchDevto<T>(path: string, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(`${DEVTO_API_BASE}${path}`, {
      next: { revalidate: 3600 },
    })

    if (res.status === 429 && attempt < retries - 1) {
      // Rate limited — wait with exponential backoff before retrying
      const delay = Math.pow(2, attempt + 1) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      continue
    }

    if (!res.ok) {
      throw new Error(`Dev.to API error: ${res.status} ${res.statusText}`)
    }

    return res.json() as Promise<T>
  }

  throw new Error('Dev.to API: max retries exceeded')
}

function normalizeDevtoArticle(article: TDevtoArticle): TBlogCardMetadata {
  return {
    id: String(article.id),
    title: article.title,
    readTimeInMinutes: article.reading_time_minutes,
    brief: article.description,
    publishedAt: article.published_at,
    updatedAt: article.edited_at ?? undefined,
    slug: article.slug,
    tags: (
      Array.isArray(article.tag_list)
        ? article.tag_list
        : typeof article.tag_list === 'string'
          ? (article.tag_list as string).split(',').map(t => t.trim()).filter(Boolean)
          : []
    ).map(name => ({ name })),
    author: { name: article.user.name },
    source: 'devto',
    sourceUrl: article.url,
    coverImage: article.cover_image ?? undefined,
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

function normalizeDevtoComment(comment: TDevtoComment): TBlogComment {
  return {
    id: comment.id_code,
    createdAt: comment.created_at,
    bodyHtml: comment.body_html,
    user: {
      name: comment.user.name,
      username: comment.user.username,
      profileImage: comment.user.profile_image,
    },
    children: comment.children.map(normalizeDevtoComment),
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

// Cache the full list of Dev.to posts to avoid redundant API calls during build.
// Multiple pages/generateStaticParams/generateMetadata calls all need the list.
let cachedDevtoPosts: TBlogCardMetadata[] | null = null

export async function getAllDevtoPosts(): Promise<TBlogCardMetadata[]> {
  if (cachedDevtoPosts) return cachedDevtoPosts

  const allPosts: TBlogCardMetadata[] = []
  let page = 1

  while (true) {
    const posts = await getDevtoPosts(page, DEVTO_BLOGS_PER_PAGE)
    if (posts.length === 0) break
    allPosts.push(...posts)
    if (posts.length < DEVTO_BLOGS_PER_PAGE) break
    page++
  }

  cachedDevtoPosts = allPosts
  return allPosts
}

export async function getDevtoPostBySlug(
  slug: string,
): Promise<TBlogPostDetail | null> {
  try {
    // Articles published under orgs use the org's username in the path,
    // not the author's. To handle this, we first resolve the slug to an
    // article ID via the list endpoint, then fetch by ID for the full body.
    const allPosts = await getAllDevtoPosts()
    const match = allPosts.find(p => p.slug === slug)
    if (!match) return null

    const articleId = Number(match.id)
    const article = await fetchDevto<TDevtoArticleDetail>(
      `/articles/${articleId}`,
    )

    const card = normalizeDevtoArticle(article)

    return {
      ...card,
      content: {
        markdown: article.body_markdown,
        html: article.body_html,
      },
      // Comments are fetched separately via getDevtoComments() at runtime
      // to avoid 429 rate limits during static builds.
    }
  } catch (error) {
    console.error(`Failed to fetch Dev.to post by slug: ${slug}`, error)
    return null
  }
}

export async function getDevtoComments(
  articleId: number,
): Promise<TBlogComment[]> {
  try {
    const comments = await fetchDevto<TDevtoComment[]>(
      `/comments?a_id=${articleId}`,
    )
    return comments.map(normalizeDevtoComment)
  } catch (error) {
    console.error(
      `Failed to fetch Dev.to comments for article: ${articleId}`,
      error,
    )
    return []
  }
}

export async function getDevtoPostsCount(): Promise<number> {
  const allPosts = await getAllDevtoPosts()
  return allPosts.length
}

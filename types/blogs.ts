export type BlogSource = 'devto' | 'hashnode'

export type TBlogCardMetadata = {
  id: string
  title: string
  readTimeInMinutes: number
  brief?: string
  publishedAt: string
  updatedAt?: string
  slug: string
  tags?: { name: string }[]
  author: { name: string }
  source: BlogSource
  sourceUrl: string
  coverImage?: string
  commentsCount: number
  reactionsCount: number
  organization?: {
    name: string
    username: string
    profileImage: string
  }
}

export type TBlogComment = {
  id: string
  createdAt: string
  bodyHtml: string
  user: {
    name: string
    username: string
    profileImage: string
  }
  children: TBlogComment[]
}

export type TBlogPostDetail = TBlogCardMetadata & {
  subtitle?: string
  seo?: { description?: string }
  content: { markdown: string; html?: string }
  comments?: TBlogComment[]
}

// ----- Dev.to API response types -----

export type TDevtoArticle = {
  id: number
  title: string
  description: string
  readable_publish_date: string
  slug: string
  path: string
  url: string
  comments_count: number
  public_reactions_count: number
  published_timestamp: string
  published_at: string
  edited_at: string | null
  tag_list: string[] | string
  tags: string
  canonical_url: string
  cover_image: string | null
  social_image: string
  reading_time_minutes: number
  user: {
    name: string
    username: string
    profile_image: string
  }
  organization?: {
    name: string
    username: string
    profile_image: string
  }
}

export type TDevtoArticleDetail = TDevtoArticle & {
  body_markdown: string
  body_html: string
}

export type TDevtoComment = {
  id_code: string
  created_at: string
  body_html: string
  user: {
    name: string
    username: string
    profile_image: string
  }
  children: TDevtoComment[]
}

// ----- Hashnode API response types (kept for GraphQL responses) -----

export type THashnodePost = {
  id: string
  title: string
  subtitle?: string
  brief?: string
  readTimeInMinutes: number
  publishedAt: string
  updatedAt?: string
  slug: string
  tags?: { name: string }[]
  coverImage?: { url?: string }
  content: { markdown: string }
  seo?: { description?: string }
  author: { name: string }
}

export type THashnodePublicationPostBySlugResponse = {
  publication?: {
    post?: THashnodePost
  }
}

// ----- Legacy types kept for newsletter -----

export type TSubscribeToNewsletterResponse = {
  data?: {
    subscribeToNewsletter?: {
      status: string
    }
  }
  errors?: { message: string }[]
}

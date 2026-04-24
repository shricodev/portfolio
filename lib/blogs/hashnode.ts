import request, { gql } from 'graphql-request'
import { env } from '@/lib/env'
import {
  HASHNODE_FCC_HOST,
} from '@/lib/constants'
import type {
  THashnodePublicationPostBySlugResponse,
  THashnodePost,
  TBlogCardMetadata,
  TBlogPostDetail,
} from '@/types/blogs'

// FCC publication ID and shricodev author ID on Hashnode
const HASHNODE_FCC_PUBLICATION_ID = '65dc2b7cbb4eb0cd565b4463'
const HASHNODE_AUTHOR_ID = '641fd8b0be4ca15b2ad2a590'

type TSearchPostsResponse = {
  searchPostsOfPublication?: {
    edges?: {
      node?: THashnodePost
    }[]
  }
}

const QUERIES = {
  GET_PUBLICATION_POST_BY_SLUG: gql`
    query getPublicationPostBySlug($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          subtitle
          brief
          readTimeInMinutes
          publishedAt
          updatedAt
          slug
          tags {
            name
          }
          coverImage {
            url
          }
          content {
            markdown
          }
          seo {
            description
          }
          author {
            name
          }
        }
      }
    }
  `,
}

class BlogAPIError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(
      originalError instanceof Error
        ? `${message}: ${originalError.message}`
        : message,
    )
    this.name = 'BlogAPIError'
  }
}

async function executeGraphQLRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  errorMessage: string,
): Promise<T> {
  try {
    return await request<T>(
      env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
      query,
      variables,
    )
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    throw new BlogAPIError(errorMessage, error)
  }
}

function normalizeHashnodePost(post: THashnodePost): TBlogCardMetadata {
  return {
    id: post.id,
    title: post.title,
    readTimeInMinutes: post.readTimeInMinutes,
    brief: post.brief,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    slug: post.slug,
    tags: post.tags,
    author: post.author,
    source: 'hashnode',
    sourceUrl: `https://${HASHNODE_FCC_HOST}/${post.slug}`,
    coverImage: post.coverImage?.url,
    commentsCount: 0,
    reactionsCount: 0,
  }
}

function normalizeHashnodePostDetail(post: THashnodePost): TBlogPostDetail {
  return {
    ...normalizeHashnodePost(post),
    subtitle: post.subtitle,
    seo: post.seo,
    content: { markdown: post.content.markdown },
  }
}

export async function getAllHashnodeFCCPosts(): Promise<TBlogCardMetadata[]> {
  // Use raw fetch instead of graphql-request to avoid type serialization issues
  // with Hashnode's custom scalar types (ObjectId).
  const query = `query($first: Int!, $filter: SearchPostsOfPublicationFilter!) {
    searchPostsOfPublication(first: $first, filter: $filter) {
      edges {
        node {
          id title subtitle brief readTimeInMinutes publishedAt updatedAt slug
          tags { name }
          coverImage { url }
          content { markdown }
          seo { description }
          author { name }
        }
      }
    }
  }`

  const res = await fetch(env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: {
        first: 20,
        filter: {
          publicationId: HASHNODE_FCC_PUBLICATION_ID,
          authorIds: [HASHNODE_AUTHOR_ID],
        },
      },
    }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Failed to fetch Hashnode FCC posts:', res.status, body)
    return []
  }

  const json = (await res.json()) as { data?: TSearchPostsResponse }
  const edges = json.data?.searchPostsOfPublication?.edges ?? []
  return edges
    .map(edge => edge?.node)
    .filter((node): node is THashnodePost => !!node)
    .map(normalizeHashnodePost)
}

export async function getHashnodeFCCPostBySlug(
  slug: string,
): Promise<TBlogPostDetail | null> {
  try {
    const response =
      await executeGraphQLRequest<THashnodePublicationPostBySlugResponse>(
        QUERIES.GET_PUBLICATION_POST_BY_SLUG,
        { host: HASHNODE_FCC_HOST, slug },
        'Failed to fetch Hashnode FCC post by slug',
      )

    const post = response.publication?.post
    if (!post) return null

    return normalizeHashnodePostDetail(post)
  } catch (error) {
    console.error(`Failed to fetch Hashnode FCC post by slug: ${slug}`, error)
    return null
  }
}


import Image from 'next/image'
import { ArrowUpRightIcon } from '@/components/icons'
import { BackLink } from '@/components/back-link'
import { BlogToc } from '@/components/blog-toc'
import { SOURCE_LABELS } from '@/components/post-row'
import {
  getBlogPostBySlug,
  getBlogPostCardBySlug,
  getAllBlogPostSlugs,
} from '@/lib/blogs'
import { BASE_URL } from '@/lib/constants'
import { canOptimizeImage } from '@/lib/image-hosts'
import { renderMarkdown } from '@/lib/markdown/render'
import { formatCount, formatDate, serializeJsonLd } from '@/lib/utils'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

// Rebuild each article at most once an hour.
export const revalidate = 3600

// Every post is built ahead of time, new ones show up on first visit.
export async function generateStaticParams() {
  try {
    return await getAllBlogPostSlugs()
  } catch (error) {
    console.error('Could not list blog posts to prerender', error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const post = await getBlogPostCardBySlug(slug).catch(() => null)
  if (!post) return { title: 'Blog post' }

  const meta = {
    title: post.title,
    description: post.seo?.description || post.brief || undefined,
  }
  const images = post.coverImage ? [{ url: post.coverImage }] : undefined

  return {
    ...meta,
    // The original publisher is canonical and this copy stays out of the
    // index, so search engines don't see duplicate content.
    alternates: { canonical: post.sourceUrl },
    robots: { index: false, follow: true },
    openGraph: {
      ...meta,
      type: 'article',
      publishedTime: post.publishedAt,
      url: new URL(`/blogs/${slug}`, BASE_URL).toString(),
      images,
    },
    twitter: { ...meta, card: 'summary_large_image', images },
  }
}

async function loadPost(slug: string) {
  try {
    return await getBlogPostBySlug(slug)
  } catch (error) {
    console.error(`Could not load blog post: ${slug}`, error)
    // A flaky API shouldn't fail the whole build. At runtime we rethrow so
    // the previously cached page keeps being served.
    if (process.env.NEXT_PHASE === 'phase-production-build') return null
    throw error
  }
}

export default async function Page(props: Props) {
  const { slug } = await props.params
  const post = await loadPost(slug)
  if (!post) notFound()

  const sourceName = SOURCE_LABELS[post.source]
  const { content, toc } = await renderMarkdown(post.content.markdown, {
    embeds: true,
  })

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo?.description || post.brief,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: post.sourceUrl,
    url: new URL(`/blogs/${slug}`, BASE_URL).toString(),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Shrijal Acharya',
      url: BASE_URL,
    },
  }

  const meta = [
    formatDate(post.publishedAt),
    `${post.readTimeInMinutes} min read`,
    post.reactionsCount > 0
      ? `${formatCount(post.reactionsCount)} reactions`
      : null,
    post.commentsCount > 0 ? `${post.commentsCount} comments` : null,
  ].filter(Boolean)

  return (
    <section>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogJsonLd) }}
      />
      <BackLink href='/blogs' label='All blogs' />

      <header className='mt-8'>
        <p className='eyebrow'>
          {sourceName}
          {post.organization ? ` / ${post.organization.name}` : ''}
        </p>
        <h1 className='mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl'>
          {post.title}
        </h1>
        {post.subtitle && (
          <p className='text-muted-foreground mt-3 text-lg'>{post.subtitle}</p>
        )}

        <p className='text-muted-foreground mt-5 flex flex-wrap gap-x-2 gap-y-1 text-sm'>
          {meta.map((item, index) => (
            <span key={item} className='flex gap-2'>
              {index > 0 && <span aria-hidden='true'>/</span>}
              {item}
            </span>
          ))}
        </p>

        {post.tags && post.tags.length > 0 && (
          <ul className='mt-4 flex flex-wrap gap-x-3 gap-y-1'>
            {post.tags.map(tag => (
              <li
                key={tag.name}
                className='text-muted-foreground font-mono text-xs'
              >
                #{tag.name}
              </li>
            ))}
          </ul>
        )}
      </header>

      {post.coverImage && (
        // fixed ratio box, so the page doesn't jump when the image arrives
        <div className='border-border bg-muted relative mt-8 aspect-[1000/420] w-full overflow-hidden rounded-lg border'>
          <Image
            src={post.coverImage}
            alt=''
            fill
            sizes='(max-width: 768px) 100vw, 720px'
            className='object-cover'
            preload
            unoptimized={!canOptimizeImage(post.coverImage)}
          />
        </div>
      )}

      <article className='prose mt-10 max-w-none'>{content}</article>
      <BlogToc headings={toc} />

      <p className='border-border text-muted-foreground mt-12 border-t pt-6 text-sm'>
        Originally published on{' '}
        <a
          href={post.sourceUrl}
          target='_blank'
          rel='noreferrer noopener'
          className='text-foreground inline-flex items-center gap-0.5 underline underline-offset-4'
        >
          {sourceName}
          <ArrowUpRightIcon className='size-3.5' />
        </a>
        . Reactions and comments live there.
      </p>
    </section>
  )
}

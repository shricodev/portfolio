import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  HeartIcon,
  CommentIcon,
  DevToIcon,
  FreeCodeCampIcon,
} from '@/components/icons'
import { formatDate, serializeJsonLd } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/user-avatar'
import {
  getBlogPostBySlug,
  getBlogPostCardBySlug,
  decodeSourceSlug,
} from '@/lib/blogs'
import type { Metadata } from 'next'
import { BASE_URL } from '@/lib/constants'
import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { BlogToc } from '@/components/blog-toc'
import { renderBlogContent } from '@/lib/blogs/render'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const DEFAULT_METADATA = {
    title: 'Blog by Shrijal Acharya',
    description:
      'Explore the blog by Shrijal Acharya, covering programming, development, and tech insights.',
  }

  try {
    const post = await getBlogPostCardBySlug(slug)
    if (!post) throw new Error('Post not found')

    const { title, seo, brief, coverImage, sourceUrl } = post
    const description =
      seo?.description || brief || DEFAULT_METADATA.description
    const imageData = coverImage ? { images: [{ url: coverImage }] } : undefined

    const baseMetadata = { title, description }

    return {
      ...baseMetadata,
      // Canonical points at the original publisher so search engines credit
      // them instead of treating this page as duplicate content.
      alternates: {
        canonical: sourceUrl,
      },
      robots: {
        index: false,
        follow: true,
      },
      openGraph: {
        ...baseMetadata,
        url: new URL(`/blogs/${slug}`, BASE_URL).toString(),
        ...imageData,
      },
      twitter: {
        ...baseMetadata,
        card: 'summary_large_image',
        ...imageData,
      },
    }
  } catch (error) {
    console.error(`Error generating dynamic metadata for blog: ${slug}`, error)

    return {
      ...DEFAULT_METADATA,
      openGraph: {
        ...DEFAULT_METADATA,
        url: new URL(`/blogs/${slug}`, BASE_URL).toString(),
      },
      twitter: {
        ...DEFAULT_METADATA,
        card: 'summary_large_image',
      },
    }
  }
}

export default async function Page(props: Props) {
  const { slug } = await props.params
  let post
  try {
    post = await getBlogPostBySlug(slug)
  } catch (error) {
    console.error(`Error fetching blog post for slug: ${slug}`, error)
    notFound()
  }
  if (!post) notFound()

  const { source } = decodeSourceSlug(slug)
  const sourceName = source === 'devto' ? 'DEV' : 'freeCodeCamp'
  const { content, toc } = await renderBlogContent(post.content.markdown)
  const internalUrl = new URL(`/blogs/${slug}`, BASE_URL).toString()
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo?.description || post.brief,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: post.sourceUrl,
    url: internalUrl,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Shrijal Acharya',
      url: BASE_URL,
    },
  }

  return (
    <section className='pb-10'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogJsonLd) }}
      />
      <BlogToc headings={toc} />
      <Suspense
        fallback={
          <Button disabled variant='secondary' className='mb-8 flex gap-2'>
            <ArrowLeftIcon className='size-5' />
            Back to blogs
          </Button>
        }
      >
        <BackButton endpoint='blogs' />
      </Suspense>

      {post.coverImage ? (
        <div className='relative mb-6 aspect-[1000/420] w-full overflow-hidden rounded-md'>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes='(max-width: 768px) 100vw, 750px'
            className='object-cover'
            preload
            unoptimized={post.coverImage.toLowerCase().endsWith('.gif')}
          />
        </div>
      ) : null}

      <header>
        <div className='text-muted-foreground mb-3 flex flex-wrap items-center gap-2 text-sm'>
          {source === 'devto' ? (
            <DevToIcon className='size-4' />
          ) : (
            <FreeCodeCampIcon className='size-4' />
          )}
          <span>
            Originally published on{' '}
            <a
              href={post.sourceUrl}
              target='_blank'
              rel='canonical noreferrer noopener'
              className='text-foreground hover:text-muted-foreground font-semibold underline underline-offset-4'
            >
              {sourceName}
            </a>
          </span>
          {post.organization && (
            <>
              <span>·</span>
              <span>{post.organization.name}</span>
            </>
          )}
        </div>

        <h1 className='decoration-border/75 text-3xl font-bold decoration-2'>
          {post.title}
        </h1>

        {post.subtitle ? (
          <p className='text-muted-foreground py-3 text-xl font-semibold'>
            {post.subtitle}
          </p>
        ) : null}

        <div className='mt-3 flex items-center'>
          <Link href='/contact' className='flex items-center'>
            <UserAvatar className='mr-2 size-8' />
            {post.author?.name ? (
              <span className='text-muted-foreground hidden text-sm font-semibold hover:underline hover:underline-offset-2 sm:inline'>
                {post.author?.name}
              </span>
            ) : null}
            <span className='divider mr-1 sm:mx-1'>·</span>
          </Link>
          {post.publishedAt ? (
            <span className='text-muted-foreground text-sm'>
              {formatDate({ date: post.publishedAt, short: false })}
            </span>
          ) : null}
        </div>

        {(post.reactionsCount > 0 || post.commentsCount > 0) && (
          <div className='text-muted-foreground mt-3 flex items-center gap-4 text-sm'>
            {post.reactionsCount > 0 && (
              <span className='flex items-center gap-1'>
                <HeartIcon className='size-4' />
                {post.reactionsCount} reactions
              </span>
            )}
            {post.commentsCount > 0 && (
              <span className='flex items-center gap-1'>
                <CommentIcon className='size-4' />
                {post.commentsCount} comments
              </span>
            )}
          </div>
        )}

        {post.tags && post.tags.length > 0 ? (
          <div className='mt-4 flex flex-row flex-wrap gap-2'>
            {post.tags.map(tag => (
              <Badge
                key={tag.name}
                variant='secondary'
                className={'text-zinc-600 dark:text-zinc-300'}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      <article className='prose dark:prose-invert mt-12 max-w-3xl'>
        {content}
      </article>

      <div className='text-muted-foreground mt-10 flex items-center gap-4 text-sm font-medium'>
        <div className='hover:text-foreground flex items-center gap-1 hover:transition'>
          <ArrowUpRightIcon className='size-4' />
          <a href={post.sourceUrl} target='_blank' rel='noreferrer noopener'>
            View on {sourceName}
          </a>
        </div>
      </div>
    </section>
  )
}

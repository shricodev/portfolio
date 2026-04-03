import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowUpRightIcon } from '@/components/icons'
import { formatDate, parseMDX } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import MDXContent from '@/components/mdx-content'
import { UserAvatar } from '@/components/user-avatar'
import {
  getAllBlogPostsSlug,
  getBlogPostByID,
  getBlogPostIDBySlug,
} from '@/lib/blogs'
import type { Metadata } from 'next'
import { BASE_URL } from '@/lib/constants'
import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{
    slug: string
  }>
}

// Static Site Generation (SSG) to improve performance on static contents.
export async function generateStaticParams() {
  try {
    const { slugs } = await getAllBlogPostsSlug()
    return slugs
      .filter((blogSlug): blogSlug is { slug: string } =>
        Boolean(blogSlug?.slug),
      )
      .map(blogSlug => ({
        slug: blogSlug.slug,
      }))
  } catch (error) {
    console.error('Error generating static params for blogs:', error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const DEFAULT_METADATA = {
    title: 'Blog by Shrijal Acharya',
    description:
      'Explore the blog by Shrijal Acharya, covering programming, development, and tech insights.',
  }

  try {
    // NOTE: I am fetching the postId by slug but not the post by id here, because
    // I don't want to pollute the URL by including the postId anywhere like in the path or
    // in the query params.
    const blogPostIDBySlugResponse = await getBlogPostIDBySlug(slug)
    if (!blogPostIDBySlugResponse)
      throw new Error('Failed to fetch blog post ID by slug')

    const { id } = blogPostIDBySlugResponse
    // Here, we are forced to fetch the blog by ID instead of slug, because of the
    // way Hashnode has setup their API. When we fetch the blog by slug, the API
    // returns the old version of the blog post, even though it has been updated.
    // So, to get the updated version, we need to fetch by ID.
    const { post } = await getBlogPostByID(id)
    if (!post) throw new Error('Failed to fetch blog post by ID')

    const { title, seo, brief, coverImage } = post
    const description =
      seo?.description || brief || DEFAULT_METADATA.description
    const imageData = coverImage?.url
      ? {
          images: [{ url: coverImage.url }],
        }
      : undefined

    const baseMetadata = {
      title,
      description,
    }

    return {
      ...baseMetadata,
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
  try {
    // NOTE: I am fetching the postId by slug but not the post by id here, because
    // I don't want to pollute the URL by including the postId anywhere like in the path or
    // in the query params.
    const postIdResponse = await getBlogPostIDBySlug(slug)
    if (!postIdResponse) notFound()

    // Here, we are forced to fetch the blog by ID instead of slug, because of the
    // way Hashnode has setup their API. When we fetch the blog by slug, the API
    // returns the old version of the blog post, even though it has been updated.
    const { post } = await getBlogPostByID(postIdResponse.id)
    if (!post) notFound()

    const postContent = parseMDX({ markdown: post.content.markdown })

    return (
      <section className='pb-10'>
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

        {post.coverImage && post.coverImage.url ? (
          <div className='relative mb-6 w-full'>
            <Image
              src={post.coverImage.url}
              alt={post.title}
              width={750}
              height={380}
              className='rounded-md object-cover'
              priority
              // Make sure that GIFs are set to unoptimized for the animation to work.
              unoptimized={post.coverImage.url.toLowerCase().endsWith('.gif')}
            />
          </div>
        ) : null}

        <header>
          <h1 className='text-3xl font-bold decoration-border/75 decoration-2'>
            {post.title}
          </h1>

          {post.subtitle ? (
            <p className='py-3 text-xl font-semibold text-muted-foreground'>
              {post.subtitle}
            </p>
          ) : null}

          <div className='mt-3 flex items-center'>
            <Link href='/contact' className='flex items-center'>
              <UserAvatar className='mr-2 size-8' />
              {post.author?.name ? (
                <span className='hidden text-sm font-semibold text-muted-foreground hover:underline hover:underline-offset-2 sm:inline'>
                  {post.author?.name}
                </span>
              ) : null}
              <span className='divider mr-1 sm:mx-1'>•</span>
            </Link>
            {post.publishedAt ? (
              <span className='text-sm text-muted-foreground'>
                {formatDate({ date: post.publishedAt, short: false })}
              </span>
            ) : null}
          </div>

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
        <main className='prose mt-12 max-w-3xl dark:prose-invert'>
          <MDXContent source={postContent} />
        </main>
        <div className='mt-10 flex items-center gap-4 text-sm font-medium text-muted-foreground'>
          <div className='flex items-center gap-1 hover:text-foreground hover:transition'>
            <ArrowUpRightIcon className='size-4' />
            <a
              href='https://dev.to/shricodev'
              target='_blank'
              rel='noreferrer noopener'
            >
              DEV
            </a>
          </div>

          <div className='flex items-center gap-1 hover:text-foreground hover:transition'>
            <ArrowUpRightIcon className='size-4' />
            <a
              href='https://shricodev.hashnode.dev'
              target='_blank'
              rel='noreferrer noopener'
            >
              Hashnode
            </a>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error(`Error fetching blog post for slug: ${slug}`, error)
    notFound()
  }
}

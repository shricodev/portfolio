import { BlogList, BlogListFromUrl } from '@/components/blog-list'
import { getAllBlogPosts } from '@/lib/blogs'
import { BASE_URL } from '@/lib/constants'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Articles by Shrijal Acharya on AI agents, developer tooling, DevOps, and web development, published on DEV and freeCodeCamp.',
  alternates: {
    canonical: new URL('/blogs', BASE_URL).toString(),
  },
}

export default async function Page() {
  const posts = await getAllBlogPosts()

  return (
    <section>
      <h1 className='title'>Blogs</h1>
      <p className='lede'>
        Tutorials and build logs on AI agents, developer tooling, DevOps, and
        the web. Everything here is published on{' '}
        <a
          href='https://dev.to/shricodev'
          target='_blank'
          rel='noreferrer noopener'
          className='text-foreground underline underline-offset-4'
        >
          DEV
        </a>{' '}
        or{' '}
        <a
          href='https://www.freecodecamp.org/news/author/shricodev/'
          target='_blank'
          rel='noreferrer noopener'
          className='text-foreground underline underline-offset-4'
        >
          freeCodeCamp
        </a>{' '}
        and mirrored here.
      </p>

      <div className='mt-10'>
        {/* the fallback is the same list, so there's nothing to flash */}
        <Suspense fallback={<BlogList posts={posts} />}>
          <BlogListFromUrl posts={posts} />
        </Suspense>
      </div>
    </section>
  )
}

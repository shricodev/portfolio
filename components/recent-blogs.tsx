import Link from 'next/link'
import { Blogs } from '@/components/blogs'
import { TBlogCardMetadata } from '@/types/blogs'

interface RecentPostsProps {
  blogPosts: TBlogCardMetadata[]
}

export default function RecentBlogs({ blogPosts }: RecentPostsProps) {
  return (
    <section className='my-16'>
      <h2 className='title'>Recent blogs</h2>
      <Blogs blogsWithMeta={blogPosts} />

      <Link
        href='/blogs'
        className='mt-8 inline-flex items-center gap-2 text-sm font-semibold'
      >
        <span className='text-muted-foreground underline underline-offset-4 hover:text-foreground hover:transition'>
          All blogs
        </span>
      </Link>
    </section>
  )
}

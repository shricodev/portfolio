import { BlogCard } from '@/components/blog-card'
import {
  SEARCH_QUERY_PARAM,
  SOURCE_QUERY_PARAM,
  type BlogSourceFilter,
} from '@/lib/constants'
import { TBlogCardMetadata } from '@/types/blogs'

interface BlogsProps {
  blogsWithMeta: TBlogCardMetadata[]
  searchParams?: {
    [SEARCH_QUERY_PARAM]?: string
    [SOURCE_QUERY_PARAM]?: BlogSourceFilter
  }
}

export const Blogs = ({ blogsWithMeta, searchParams }: BlogsProps) => {
  return (
    <>
      {blogsWithMeta && blogsWithMeta.length === 0 ? (
        <p className='text-sm font-medium text-muted-foreground'>
          No results found
        </p>
      ) : (
        <ul className='flex flex-col gap-8'>
          {blogsWithMeta?.length &&
            blogsWithMeta.map(blogMeta => (
              <li key={`${blogMeta.source}_${blogMeta.slug}`}>
                <BlogCard blogWithMeta={blogMeta} searchParams={searchParams} />
              </li>
            ))}
        </ul>
      )}
    </>
  )
}

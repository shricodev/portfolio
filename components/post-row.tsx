import Image from 'next/image'
import Link from 'next/link'
import type { TBlogCardMetadata } from '@/types/blogs'
import { encodeSourceSlug } from '@/lib/blogs/slug'
import { canOptimizeImage } from '@/lib/image-hosts'
import { formatCount, formatDate } from '@/lib/utils'

export const SOURCE_LABELS = { devto: 'DEV', hashnode: 'freeCodeCamp' } as const

interface PostRowProps {
  post: TBlogCardMetadata
  // when set, tags filter in place instead of navigating
  onTagClick?: (tag: string) => void
}

export function PostRow({ post, onTagClick }: PostRowProps) {
  const href = `/blogs/${encodeSourceSlug(post.source, post.slug)}`
  const tags = post.tags?.slice(0, 4) ?? []

  return (
    <article className='group flex gap-5 py-6'>
      <div className='min-w-0 flex-1'>
        <p className='text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs'>
          <span>{SOURCE_LABELS[post.source]}</span>
          <span aria-hidden='true'>/</span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt, 'short')}
          </time>
          <span aria-hidden='true'>/</span>
          <span>{post.readTimeInMinutes} min read</span>
          {post.reactionsCount > 0 && (
            <>
              <span aria-hidden='true'>/</span>
              <span>{formatCount(post.reactionsCount)} reactions</span>
            </>
          )}
        </p>

        <h3 className='mt-2 text-base leading-snug font-medium text-balance'>
          <Link
            href={href}
            className='decoration-muted-foreground/50 underline-offset-4 group-hover:underline'
          >
            {post.title}
          </Link>
        </h3>

        {post.brief && (
          <p className='text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-6'>
            {post.brief}
          </p>
        )}

        {tags.length > 0 && (
          <ul className='mt-3 flex flex-wrap gap-x-3 gap-y-1'>
            {tags.map(tag => (
              <li key={tag.name}>
                {onTagClick ? (
                  <button
                    type='button'
                    onClick={() => onTagClick(tag.name)}
                    className='text-muted-foreground hover:text-foreground font-mono text-xs'
                  >
                    #{tag.name}
                  </button>
                ) : (
                  <Link
                    href={`/blogs?q=${encodeURIComponent(tag.name)}`}
                    className='text-muted-foreground hover:text-foreground font-mono text-xs'
                  >
                    #{tag.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {post.coverImage && (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden='true'
          className='border-border bg-muted relative hidden h-[76px] w-[136px] shrink-0 overflow-hidden rounded-md border sm:block'
        >
          <Image
            src={post.coverImage}
            alt=''
            fill
            sizes='136px'
            className='object-cover'
            unoptimized={!canOptimizeImage(post.coverImage)}
          />
        </Link>
      )}
    </article>
  )
}

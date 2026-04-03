'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { TBlogCardMetadata } from '@/types/blogs'
import { UserAvatar } from '@/components/user-avatar'
import { Badge } from '@/components/ui/badge'
import {
  BookIcon,
  HeartIcon,
  CommentIcon,
  DevToIcon,
  FreeCodeCampIcon,
} from '@/components/icons'
import { useRouter } from 'next/navigation'
import {
  PAGE_INDEX_DEFAULT,
  PAGE_QUERY_PARAM,
  PER_PAGE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
} from '@/lib/constants'
import { encodeSourceSlug } from '@/lib/blogs'

interface BlogCardProps {
  blogWithMeta: TBlogCardMetadata
  searchParams?: {
    [SEARCH_QUERY_PARAM]?: string
    [PAGE_QUERY_PARAM]?: string
    [PER_PAGE_QUERY_PARAM]?: string
  }
}

export const BlogCard = ({ blogWithMeta, searchParams }: BlogCardProps) => {
  const router = useRouter()

  const {
    title,
    author,
    tags,
    brief,
    slug,
    source,
    readTimeInMinutes,
    publishedAt,
    coverImage,
    reactionsCount,
    commentsCount,
    organization,
  } = blogWithMeta

  const encodedSlug = encodeSourceSlug(source, slug)

  const handleBadgeClick = (language: string) => {
    const params = new URLSearchParams(searchParams)

    // Set the new search query
    params.set(SEARCH_QUERY_PARAM, language)

    // Reset page to 1 when applying a new search
    params.set(PAGE_QUERY_PARAM, PAGE_INDEX_DEFAULT.toString())

    router.push(`/blogs?${params.toString()}`)
  }

  const sourceLabel = source === 'devto' ? 'DEV' : 'freeCodeCamp'

  return (
    <Card className='w-full border-none bg-zinc-50 dark:bg-zinc-900'>
      <div className='flex flex-1 flex-col justify-between'>
        <CardHeader>
          <div className='mb-2 flex items-center gap-2'>
            {source === 'devto' ? (
              <DevToIcon className='size-4 text-muted-foreground' />
            ) : (
              <FreeCodeCampIcon className='size-4 text-muted-foreground' />
            )}
            <span className='text-xs text-muted-foreground'>{sourceLabel}</span>
            {organization && (
              <>
                <span className='text-xs text-muted-foreground'>·</span>
                <span className='text-xs text-muted-foreground'>
                  {organization.name}
                </span>
              </>
            )}
          </div>

          <div className='flex gap-4'>
            {coverImage && (
              <div className='hidden flex-shrink-0 sm:block'>
                <Image
                  src={coverImage}
                  alt={title}
                  width={120}
                  height={68}
                  className='rounded-md object-cover'
                  unoptimized={coverImage.toLowerCase().endsWith('.gif')}
                />
              </div>
            )}
            <div className='flex-1'>
              <Link
                className='flex flex-col'
                href={{
                  pathname: `/blogs/${encodedSlug}`,
                  ...(searchParams && {
                    query: {
                      ...(searchParams[SEARCH_QUERY_PARAM]
                        ? {
                            [SEARCH_QUERY_PARAM]:
                              searchParams[SEARCH_QUERY_PARAM],
                          }
                        : {}),
                      ...(searchParams[PAGE_QUERY_PARAM]
                        ? {
                            [PAGE_QUERY_PARAM]:
                              searchParams[PAGE_QUERY_PARAM],
                          }
                        : {}),
                      ...(searchParams[PER_PAGE_QUERY_PARAM]
                        ? {
                            [PER_PAGE_QUERY_PARAM]:
                              searchParams[PER_PAGE_QUERY_PARAM],
                          }
                        : {}),
                    },
                  }),
                }}
              >
                <CardTitle className='text-lg font-semibold hover:underline hover:underline-offset-4'>
                  {title}
                </CardTitle>
              </Link>
              {tags && tags.length > 0 ? (
                <div className='flex flex-wrap gap-2 py-2'>
                  {tags.map(tag => (
                    <Badge
                      key={tag.name}
                      variant='secondary'
                      className='cursor-pointer text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400'
                      onClick={() => handleBadgeClick(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </CardHeader>

        {brief && (
          <Link className='flex flex-col' href={`/blogs/${encodedSlug}`}>
            <CardContent className='prose max-w-full text-zinc-700 dark:text-zinc-400'>
              {brief}
            </CardContent>
          </Link>
        )}

        <CardFooter className='flex flex-wrap gap-x-1 gap-y-1 text-sm text-muted-foreground'>
          <Link href='/contact' className='flex items-center'>
            <UserAvatar className='size-7 sm:mr-2' />
            {author ? (
              <span className='hidden text-sm hover:underline hover:underline-offset-2 sm:inline'>
                {author.name}
              </span>
            ) : null}
          </Link>

          <span className='divider mx-1'>·</span>

          <span className='flex items-center gap-1'>
            <BookIcon className='size-4' />
            {`${readTimeInMinutes} min read`}
          </span>

          <span className='divider mx-1'>·</span>

          <span>{formatDate({ date: publishedAt, short: true })}</span>

          {(reactionsCount > 0 || commentsCount > 0) && (
            <>
              <span className='divider mx-1'>·</span>
              <span className='flex items-center gap-2'>
                {reactionsCount > 0 && (
                  <span className='flex items-center gap-1'>
                    <HeartIcon className='size-3.5' />
                    {reactionsCount}
                  </span>
                )}
                {commentsCount > 0 && (
                  <span className='flex items-center gap-1'>
                    <CommentIcon className='size-3.5' />
                    {commentsCount}
                  </span>
                )}
              </span>
            </>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}

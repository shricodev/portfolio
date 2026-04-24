'use client'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeftIcon } from '@/components/icons'
import { useSearchParams } from 'next/navigation'
import {
  SEARCH_QUERY_PARAM,
  SOURCE_QUERY_PARAM,
} from '@/lib/constants'

interface BackButtonProps {
  endpoint: 'projects' | 'blogs'
}

export const BackButton = ({ endpoint }: BackButtonProps) => {
  const searchParams = useSearchParams()

  const searchQueryParam = searchParams.get(SEARCH_QUERY_PARAM)
  const sourceQueryParam =
    endpoint === 'blogs' ? searchParams.get(SOURCE_QUERY_PARAM) : null

  return (
    <Link
      href={{
        pathname: `/${endpoint}`,
        query: {
          ...(searchQueryParam
            ? { [SEARCH_QUERY_PARAM]: searchQueryParam }
            : {}),
          ...(sourceQueryParam
            ? { [SOURCE_QUERY_PARAM]: sourceQueryParam }
            : {}),
        },
      }}
      className={buttonVariants({
        variant: 'secondary',
        className: 'mb-8 flex gap-2',
      })}
    >
      <ArrowLeftIcon className='size-5' />
      Back to {endpoint}
    </Link>
  )
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  PAGE_INDEX_DEFAULT,
  PAGE_QUERY_PARAM,
  SOURCE_QUERY_PARAM,
  BLOG_SOURCE_OPTIONS,
  type BlogSourceFilter,
} from '@/lib/constants'

const LABELS: Record<BlogSourceFilter, string> = {
  all: 'All',
  devto: 'DEV',
  freecodecamp: 'freeCodeCamp',
}

export function SourceFilter({ current }: { current: BlogSourceFilter }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = (value: BlogSourceFilter) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') {
      params.delete(SOURCE_QUERY_PARAM)
    } else {
      params.set(SOURCE_QUERY_PARAM, value)
    }
    // Reset to page 1 when changing source
    params.set(PAGE_QUERY_PARAM, PAGE_INDEX_DEFAULT.toString())
    router.push(`/blogs?${params.toString()}`)
  }

  return (
    <div className='mb-4 flex gap-2'>
      {BLOG_SOURCE_OPTIONS.map(option => (
        <Button
          key={option}
          variant={current === option ? 'default' : 'outline'}
          size='sm'
          onClick={() => handleClick(option)}
          className='text-xs'
        >
          {LABELS[option]}
        </Button>
      ))}
    </div>
  )
}

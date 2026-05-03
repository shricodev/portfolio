'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
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
    const qs = params.toString()
    router.push(qs ? `/blogs?${qs}` : '/blogs')
  }

  return (
    <div className='mb-4 flex gap-2'>
      {BLOG_SOURCE_OPTIONS.map(option => {
        const active = current === option
        return (
          <Button
            key={option}
            variant={active ? 'secondary' : 'ghost'}
            size='sm'
            onClick={() => handleClick(option)}
            aria-pressed={active}
            className='text-xs'
          >
            {LABELS[option]}
          </Button>
        )
      })}
    </div>
  )
}

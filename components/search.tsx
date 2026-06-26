'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { CrossIcon } from '@/components/icons'
import { DEBOUNCE_TIME_DEFAULT, SEARCH_QUERY_PARAM } from '@/lib/constants'

interface SearchProps {
  endpoint: 'projects' | 'blogs'
  query?: string
  placeholder: string
  debounceTime?: number
}

export const Search = ({
  endpoint,
  placeholder,
  query,
  debounceTime = DEBOUNCE_TIME_DEFAULT,
}: SearchProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const normalizedQuery = query ?? ''
  const [filterText, setFilterText] = useState(normalizedQuery)
  const [prevQuery, setPrevQuery] = useState(normalizedQuery)
  const [debouncedQuery] = useDebounce(filterText, debounceTime)

  // Every value we push to the URL ourselves. Each push round-trips through
  // the server and comes back as the `query` prop, but in prod that's slow,
  // so a stale echo can land after the user has typed more. We remember what
  // we pushed and ignore it on the way back so it can't clobber newer input.
  const pushedValues = useRef<Set<string>>(new Set([normalizedQuery]))

  // Sync input only from genuinely external navigation (tag-click on a card,
  // back/forward), never from an echo of our own debounced push.
  if (normalizedQuery !== prevQuery) {
    setPrevQuery(normalizedQuery)
    if (
      !pushedValues.current.has(normalizedQuery) &&
      normalizedQuery !== filterText
    ) {
      setFilterText(normalizedQuery)
    }
  }

  useEffect(() => {
    // Wait for useDebounce to settle on the latest input before pushing,
    // which prevents an intermediate stale value from being echoed to the URL.
    if (debouncedQuery !== filterText) return
    if (debouncedQuery === normalizedQuery) {
      // URL has caught up to the input, so older pushes are settled.
      pushedValues.current = new Set([normalizedQuery])
      return
    }

    pushedValues.current.add(debouncedQuery)

    const newSearchParams = new URLSearchParams(searchParams)
    if (debouncedQuery) {
      newSearchParams.set(SEARCH_QUERY_PARAM, debouncedQuery)
    } else {
      newSearchParams.delete(SEARCH_QUERY_PARAM)
    }
    const qs = newSearchParams.toString()
    router.push(qs ? `/${endpoint}?${qs}` : `/${endpoint}`)
  }, [debouncedQuery, filterText, normalizedQuery, endpoint, router, searchParams])

  const resetFilter = () => {
    setFilterText('')
    if (!normalizedQuery) return
    pushedValues.current.add('')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete(SEARCH_QUERY_PARAM)
    const qs = newSearchParams.toString()
    router.push(qs ? `/${endpoint}?${qs}` : `/${endpoint}`)
  }

  return (
    <div className='mb-4 flex items-center gap-3'>
      <Input
        type='text'
        placeholder={placeholder}
        className='h-9 w-full sm:w-1/2'
        value={filterText}
        onChange={event => setFilterText(event.target.value)}
      />

      {filterText.length > 0 ? (
        <Button
          size='default'
          variant='secondary'
          onClick={resetFilter}
          className='h-8 px-2 text-zinc-700 dark:text-zinc-400 lg:px-3'
        >
          Reset
          <CrossIcon className='size-5' />
        </Button>
      ) : null}
    </div>
  )
}

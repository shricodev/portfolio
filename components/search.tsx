'use client'

import { useEffect, useState } from 'react'
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
  const [searchState, setSearchState] = useState(() => ({
    filterText: normalizedQuery,
    previousQuery: normalizedQuery,
    locallyEnteredQueries: new Set<string>(),
  }))
  const { filterText } = searchState
  const [debouncedQuery] = useDebounce(filterText, debounceTime)

  // Sync input only from genuinely external navigation (tag-click on a card,
  // back/forward), never from an echo of our own debounced push.
  if (normalizedQuery !== searchState.previousQuery) {
    const locallyEnteredQueries = new Set(searchState.locallyEnteredQueries)
    const isLocalEcho = locallyEnteredQueries.delete(normalizedQuery)
    setSearchState({
      filterText: isLocalEcho ? filterText : normalizedQuery,
      previousQuery: normalizedQuery,
      locallyEnteredQueries,
    })
  }

  useEffect(() => {
    // Wait for useDebounce to settle on the latest input before pushing,
    // which prevents an intermediate stale value from being echoed to the URL.
    if (debouncedQuery !== filterText) return
    if (debouncedQuery === normalizedQuery) return

    const newSearchParams = new URLSearchParams(searchParams)
    if (debouncedQuery) {
      newSearchParams.set(SEARCH_QUERY_PARAM, debouncedQuery)
    } else {
      newSearchParams.delete(SEARCH_QUERY_PARAM)
    }
    const qs = newSearchParams.toString()
    router.push(qs ? `/${endpoint}?${qs}` : `/${endpoint}`)
  }, [
    debouncedQuery,
    filterText,
    normalizedQuery,
    endpoint,
    router,
    searchParams,
  ])

  const updateFilter = (value: string) => {
    setSearchState(previous => {
      const locallyEnteredQueries = new Set(previous.locallyEnteredQueries)
      locallyEnteredQueries.add(value)
      return { ...previous, filterText: value, locallyEnteredQueries }
    })
  }

  const resetFilter = () => {
    updateFilter('')
    if (!normalizedQuery) return
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete(SEARCH_QUERY_PARAM)
    const qs = newSearchParams.toString()
    router.push(qs ? `/${endpoint}?${qs}` : `/${endpoint}`)
  }

  return (
    <div className='mb-4 flex items-center gap-3'>
      <Input
        type='text'
        aria-label={`Search ${endpoint}`}
        placeholder={placeholder}
        className='h-9 w-full sm:w-1/2'
        value={filterText}
        onChange={event => updateFilter(event.target.value)}
      />

      {filterText.length > 0 ? (
        <Button
          size='default'
          variant='secondary'
          onClick={resetFilter}
          className='h-8 px-2 text-zinc-700 lg:px-3 dark:text-zinc-400'
        >
          Reset
          <CrossIcon className='size-5' />
        </Button>
      ) : null}
    </div>
  )
}

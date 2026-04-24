'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type FetchPage<T> = (args: {
  page: number
  signal: AbortSignal
}) => Promise<{ items: T[]; hasMore: boolean }>

export interface UseInfiniteScrollParams<T> {
  initialItems: T[]
  initialHasMore: boolean
  fetchPage: FetchPage<T>
  resetKey: string
  rootMargin?: string
}

export interface UseInfiniteScrollResult<T> {
  items: T[]
  isLoadingMore: boolean
  hasMore: boolean
  error: Error | null
  retry: () => void
  sentinelRef: (node: HTMLElement | null) => void
}

interface State<T> {
  items: T[]
  page: number
  hasMore: boolean
  isLoadingMore: boolean
  error: Error | null
  resetKey: string
}

export function useInfiniteScroll<T>({
  initialItems,
  initialHasMore,
  fetchPage,
  resetKey,
  rootMargin = '400px 0px',
}: UseInfiniteScrollParams<T>): UseInfiniteScrollResult<T> {
  const [state, setState] = useState<State<T>>(() => ({
    items: initialItems,
    page: 1,
    hasMore: initialHasMore,
    isLoadingMore: false,
    error: null,
    resetKey,
  }))

  // React canonical pattern for state derived from a prop-driven key: adjust
  // during render. Seeds the new server-rendered page 1 without a client-side
  // refetch (no skeleton flicker on filter changes).
  if (state.resetKey !== resetKey) {
    setState({
      items: initialItems,
      page: 1,
      hasMore: initialHasMore,
      isLoadingMore: false,
      error: null,
      resetKey,
    })
  }

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  })

  const abortRef = useRef<AbortController | null>(null)
  const loadingGuardRef = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      abortRef.current = null
      loadingGuardRef.current = false
    }
  }, [resetKey])

  const fetchNext = useCallback(
    async (targetPage: number, keyAtStart: string) => {
      if (loadingGuardRef.current) return
      loadingGuardRef.current = true

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState(prev => {
        if (prev.resetKey !== keyAtStart) return prev
        return { ...prev, isLoadingMore: true, error: null }
      })

      try {
        const result = await fetchPage({
          page: targetPage,
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        setState(prev => {
          if (
            prev.resetKey !== keyAtStart ||
            prev.page !== targetPage - 1
          ) {
            return prev
          }
          return {
            ...prev,
            items: [...prev.items, ...result.items],
            page: targetPage,
            hasMore: result.hasMore,
            isLoadingMore: false,
          }
        })
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState(prev => {
          if (
            prev.resetKey !== keyAtStart ||
            prev.page !== targetPage - 1
          ) {
            return prev
          }
          return {
            ...prev,
            isLoadingMore: false,
            error: err instanceof Error ? err : new Error('Failed to load'),
          }
        })
      } finally {
        // Only release the guard if no newer fetch took ownership of abortRef.
        // Prevents a stale finally from unblocking a second in-flight fetch.
        if (abortRef.current === controller) {
          loadingGuardRef.current = false
        }
      }
    },
    [fetchPage],
  )

  const loadMore = useCallback(() => {
    const s = stateRef.current
    if (s.isLoadingMore || !s.hasMore || s.error) return
    void fetchNext(s.page + 1, s.resetKey)
  }, [fetchNext])

  const retry = useCallback(() => {
    const s = stateRef.current
    if (!s.error) return
    void fetchNext(s.page + 1, s.resetKey)
  }, [fetchNext])

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null
      if (!node) return
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting) loadMore()
        },
        { rootMargin },
      )
      observer.observe(node)
      observerRef.current = observer
    },
    [loadMore, rootMargin],
  )

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
      abortRef.current?.abort()
    }
  }, [])

  return {
    items: state.items,
    isLoadingMore: state.isLoadingMore,
    hasMore: state.hasMore,
    error: state.error,
    retry,
    sentinelRef,
  }
}

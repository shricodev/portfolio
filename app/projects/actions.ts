'use server'

import { getProjectsCount, getProjectsMetadata } from '@/lib/projects'
import type { TProjectMetadata } from '@/types/projects'

export interface FetchProjectsResult {
  items: TProjectMetadata[]
  hasMore: boolean
  filteredCount: number
  totalCount: number
}

export async function fetchProjectsPage({
  page,
  perPage,
  q,
}: {
  page: number
  perPage: number
  q?: string
}): Promise<FetchProjectsResult> {
  const trimmed = q?.trim().toLowerCase()
  const totalCount = getProjectsCount()

  if (!trimmed) {
    const items = getProjectsMetadata({ page, perPage })
    return {
      items,
      hasMore: page * perPage < totalCount,
      filteredCount: totalCount,
      totalCount,
    }
  }

  const all = getProjectsMetadata({ all: true })
  const filtered = all.filter(
    meta =>
      meta.title.toLowerCase().includes(trimmed) ||
      meta.language?.toLowerCase().includes(trimmed),
  )
  const filteredCount = filtered.length
  const start = (page - 1) * perPage
  return {
    items: filtered.slice(start, start + perPage),
    hasMore: page * perPage < filteredCount,
    filteredCount,
    totalCount,
  }
}

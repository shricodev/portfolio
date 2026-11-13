'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { TProjectListItem } from '@/types/projects'
import { ProjectCard } from '@/components/project-card'
import {
  EmptyState,
  SearchInput,
  Segmented,
  syncUrlParams,
} from '@/components/list-controls'
import { Button } from '@/components/ui/button'
import {
  LANGUAGE_QUERY_PARAM,
  LIST_BATCH_SIZE,
  SEARCH_QUERY_PARAM,
} from '@/lib/constants'

interface ProjectListProps {
  projects: TProjectListItem[]
  initialQuery?: string
  initialLanguage?: string
}

function Grid({ projects }: { projects: TProjectListItem[] }) {
  return (
    <ul className='grid gap-4 sm:grid-cols-2'>
      {projects.map(project => (
        <li key={project.title}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}

export function ProjectList({
  projects,
  initialQuery = '',
  initialLanguage = 'all',
}: ProjectListProps) {
  const [query, setQuery] = useState(initialQuery)
  const [language, setLanguage] = useState(initialLanguage)
  const [visible, setVisible] = useState(LIST_BATCH_SIZE)

  // languages ordered by how many projects use them
  const languageOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const project of projects) {
      if (project.language) {
        counts.set(project.language, (counts.get(project.language) ?? 0) + 1)
      }
    }
    return [
      { value: 'all', label: 'All' },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => ({ value: name, label: name })),
    ]
  }, [projects])

  const update = (next: { query?: string; language?: string }) => {
    const state = { query, language, ...next }
    setQuery(state.query)
    setLanguage(state.language)
    setVisible(LIST_BATCH_SIZE)
    syncUrlParams({
      [SEARCH_QUERY_PARAM]: state.query.trim() || undefined,
      [LANGUAGE_QUERY_PARAM]:
        state.language === 'all' ? undefined : state.language,
    })
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return projects.filter(project => {
      // exact match, so "Go" doesn't pull in "google-..."
      if (language !== 'all' && project.language !== language) return false
      if (!needle) return true
      return (
        project.title.toLowerCase().includes(needle) ||
        project.description.toLowerCase().includes(needle) ||
        project.topics.some(topic => topic.includes(needle))
      )
    })
  }, [projects, query, language])

  const isFiltered = query.trim() !== '' || language !== 'all'
  const featured = projects.filter(project => project.featured)

  return (
    <div>
      <div className='flex flex-col gap-3'>
        <SearchInput
          value={query}
          onChange={value => update({ query: value })}
          placeholder='Search name, description, or topic'
          label='Search projects'
        />
        <Segmented
          label='Language'
          options={languageOptions}
          value={language}
          onChange={value => update({ language: value })}
        />
      </div>

      {!isFiltered && featured.length > 0 && (
        <section aria-labelledby='featured-heading' className='mt-10'>
          <h2 id='featured-heading' className='eyebrow mb-4'>
            Featured
          </h2>
          <Grid projects={featured} />
        </section>
      )}

      <section aria-labelledby='all-heading' className='mt-10'>
        <h2 id='all-heading' className='eyebrow mb-4' aria-live='polite'>
          {isFiltered
            ? `${filtered.length} of ${projects.length} projects`
            : `All projects, newest first (${projects.length})`}
        </h2>

        {filtered.length === 0 ? (
          <EmptyState
            title='No projects match those filters.'
            onReset={() => update({ query: '', language: 'all' })}
          />
        ) : (
          <Grid projects={filtered.slice(0, visible)} />
        )}

        {filtered.length > visible && (
          <div className='mt-6 flex justify-center'>
            <Button
              variant='outline'
              onClick={() => setVisible(count => count + LIST_BATCH_SIZE)}
            >
              Show more ({filtered.length - visible} left)
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

export function ProjectListFromUrl({
  projects,
}: {
  projects: TProjectListItem[]
}) {
  const params = useSearchParams()
  const language = params.get(LANGUAGE_QUERY_PARAM)
  const known = projects.some(project => project.language === language)
  return (
    <ProjectList
      projects={projects}
      initialQuery={params.get(SEARCH_QUERY_PARAM) ?? ''}
      initialLanguage={language && known ? language : 'all'}
    />
  )
}

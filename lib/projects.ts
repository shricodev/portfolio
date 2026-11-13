import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { cache } from 'react'
import type {
  TProject,
  TProjectListItem,
  TProjectMetadata,
} from '@/types/projects'
import { FEATURED_PROJECTS, PROJECT_FILTER_TOPIC } from '@/lib/constants'

const projectsDirectory = path.resolve(process.cwd(), 'content', 'projects')
const FILE_SUFFIX = '_README.mdx'

// repo names only, so a URL param can never walk out of the content dir
const SAFE_NAME_RE = /^[\w.-]+$/

function readProject(fileName: string): TProject | null {
  try {
    const raw = fs.readFileSync(path.join(projectsDirectory, fileName), 'utf-8')
    const { data, content } = matter(raw)
    if (!data.title || !data.topics?.includes(PROJECT_FILTER_TOPIC)) return null
    return {
      metadata: { ...data, author: 'Shrijal Acharya' } as TProjectMetadata,
      content,
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Could not read project file ${fileName}`, error)
    }
    return null
  }
}

function byNewest(a: TProjectMetadata, b: TProjectMetadata) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

// Every showcased project, newest first. Files are tiny and read once per render.
export const getAllProjects = cache((): TProjectMetadata[] => {
  let files: string[] = []
  try {
    files = fs
      .readdirSync(projectsDirectory)
      .filter(name => name.endsWith(FILE_SUFFIX))
  } catch (error) {
    console.error('Could not read the projects directory', error)
    return []
  }

  return files
    .map(readProject)
    .filter((project): project is TProject => project !== null)
    .map(project => project.metadata)
    .sort(byNewest)
})

export function getFeaturedProjects(): TProjectMetadata[] {
  const all = getAllProjects()
  return FEATURED_PROJECTS.map(name =>
    all.find(project => project.title === name),
  ).filter((project): project is TProjectMetadata => project !== undefined)
}

export function getProjectByTitle(title: string): TProject | null {
  if (!SAFE_NAME_RE.test(title)) return null
  return readProject(`${title}${FILE_SUFFIX}`)
}

// Repo descriptions are written for GitHub: emoji up front, links at the end.
// Trim both so they read cleanly in a list.
export function cleanDescription(description?: string): string {
  if (!description) return ''
  return description
    .replace(/(?:blog|docs|demo)?:?\s*https?:\/\/\S+/gi, '')
    .replace(/[\p{Extended_Pictographic}️‍]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function repoUrl(project: TProjectMetadata): string {
  return project.clone_url.replace(/\.git$/, '')
}

export function toListItem(project: TProjectMetadata): TProjectListItem {
  return {
    title: project.title,
    description: cleanDescription(project.description),
    language: project.language ?? '',
    homepage: project.homepage ?? '',
    repo: repoUrl(project),
    year: project.created_at.slice(0, 4),
    topics: (project.topics ?? []).filter(
      topic => topic !== PROJECT_FILTER_TOPIC,
    ),
    featured: FEATURED_PROJECTS.includes(project.title),
  }
}

import path from 'path'
import fs from 'fs'
import { TProject, TProjectMetadata } from '@/types/projects'
import matter from 'gray-matter'
import {
  PAGE_INDEX_DEFAULT,
  PROJECT_FILTER_TOPIC,
  PROJECTS_BATCH_SIZE,
} from '@/lib/constants'

class ProjectError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(
      originalError instanceof Error
        ? `${message}: ${originalError.message}`
        : message,
    )
    this.name = 'ProjectError'
  }
}

const projectsDirectory = path.resolve(process.cwd(), 'content', 'projects')

function validateDirectory(dir: string) {
  try {
    fs.accessSync(dir, fs.constants.R_OK)
  } catch (error) {
    throw new ProjectError(
      `Directory ${dir} does not exist or is not accessible`,
      error,
    )
  }
}

function getMDXFiles({ dir }: { dir: string }): string[] {
  validateDirectory(dir)

  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.mdx')
      .map(dirent => dirent.name)
  } catch (error) {
    throw new ProjectError(
      `Failed to read MDX files from directory: ${dir}`,
      error,
    )
  }
}

export function getProjectsCount(): number {
  try {
    const projectFiles = getMDXFiles({ dir: projectsDirectory })
    return projectFiles.filter(file => {
      const metadata = getProjectMetadata({ projectFilePath: file })
      return metadata?.topics?.includes(PROJECT_FILTER_TOPIC) === true
    }).length
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to get projects length', error)
  }
}

export function getProjectByTitle({
  title,
}: {
  title: string
}): TProject | null {
  const projectFilePath = path.join(projectsDirectory, `${title}_README.mdx`)

  try {
    const projectFileContent = fs.readFileSync(projectFilePath, {
      encoding: 'utf-8',
    })

    const { data, content } = matter(projectFileContent)
    return {
      metadata: {
        ...data,
        author: 'Shrijal Acharya',
      } as TProjectMetadata,
      content,
    }
  } catch (error) {
    if (error instanceof ProjectError) throw error
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw new ProjectError(
      `Error reading project file: ${projectFilePath}`,
      error,
    )
  }
}

export function getProjectMetadata({
  projectFilePath,
}: {
  projectFilePath: string
}): TProjectMetadata | null {
  const projectAbsFilePath = path.join(projectsDirectory, projectFilePath)

  try {
    const projectFileContent = fs.readFileSync(projectAbsFilePath, {
      encoding: 'utf-8',
    })

    const { data } = matter(projectFileContent)
    return {
      ...data,
      author: 'Shrijal Acharya',
    } as TProjectMetadata
  } catch (error) {
    if (error instanceof ProjectError) throw error
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw new ProjectError(
      `Error reading metadata for file: ${projectAbsFilePath}`,
      error,
    )
  }
}

export function getProjectsMetadata({
  page = PAGE_INDEX_DEFAULT,
  perPage = PROJECTS_BATCH_SIZE,
  all = false,
}: {
  page?: number
  perPage?: number
  all?: boolean
}): TProjectMetadata[] {
  try {
    const projectFiles = getMDXFiles({ dir: projectsDirectory })
    const projectsWithMetadata = projectFiles
      .map(file => getProjectMetadata({ projectFilePath: file }))
      .filter(
        (metadata): metadata is TProjectMetadata =>
          metadata !== null &&
          metadata.topics?.includes(PROJECT_FILTER_TOPIC) === true,
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

    if (all) return projectsWithMetadata

    const start = (page - 1) * perPage
    return projectsWithMetadata.slice(start, start + perPage)
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to get projects metadata', error)
  }
}

export function getProjectsWithContent({
  page = PAGE_INDEX_DEFAULT,
  perPage = PROJECTS_BATCH_SIZE,
  all = false,
}: {
  page?: number
  perPage?: number
  all?: boolean
}): TProject[] {
  try {
    const projectFiles = getMDXFiles({ dir: projectsDirectory })
    const projectsWithContent = projectFiles
      .map(file => {
        const slug = file.replace(/_README\.mdx$/, '')
        return getProjectByTitle({ title: slug })
      })
      .filter(
        (project): project is TProject =>
          project !== null &&
          project.metadata.topics?.includes(PROJECT_FILTER_TOPIC) === true,
      )
      .sort(
        (a, b) =>
          new Date(b.metadata.created_at).getTime() -
          new Date(a.metadata.created_at).getTime(),
      )

    if (all) return projectsWithContent

    const start = (page - 1) * perPage
    return projectsWithContent.slice(start, start + perPage)
  } catch (error) {
    if (error instanceof ProjectError) throw error
    throw new ProjectError('Failed to get projects with content', error)
  }
}

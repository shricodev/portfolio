import { getProjectsMetadata } from '@/lib/projects'
import type { MetadataRoute } from 'next'
import { ROUTES, BASE_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ROUTES.map(route => {
    const normalizedRoute = `${route.replace(/^\/|\/$/g, '')}`
    return {
      url: new URL(normalizedRoute.replace(/\/+$/, ''), BASE_URL).toString(),
    }
  })

  let projectsMetadata: MetadataRoute.Sitemap = []
  try {
    const projects = getProjectsMetadata({ all: true })
    projectsMetadata = projects
      .filter(
        project => project?.title && (project.updated_at || project.created_at),
      )
      .map(project => ({
        url: new URL(`/projects/${project.title}`, BASE_URL).toString(),
        lastModified: new Date(
          project.updated_at ?? project.created_at,
        ).toISOString(),
      }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  return [...staticRoutes, ...projectsMetadata]
}

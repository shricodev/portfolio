import { getAllProjects } from '@/lib/projects'
import type { MetadataRoute } from 'next'
import { ROUTES, BASE_URL } from '@/lib/constants'

// Blog posts are left out on purpose: they are noindex and canonical to
// DEV/freeCodeCamp, where they were first published.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ROUTES.map(route => ({
    url: new URL(route || '/', BASE_URL).toString(),
  }))

  const projects = getAllProjects().map(project => ({
    url: new URL(`/projects/${project.title}`, BASE_URL).toString(),
    lastModified: new Date(project.updated_at ?? project.created_at),
  }))

  return [...staticRoutes, ...projects]
}

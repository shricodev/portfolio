import { getBlogPostsCardMeta, encodeSourceSlug } from '@/lib/blogs'
import { BASE_URL, PUBLIC_GMAIL } from '@/lib/constants'
import { getProjectsMetadata } from '@/lib/projects'
import RSS from 'rss'

export async function GET() {
  const feedConfig = {
    title: 'Shrijal Acharya',
    description:
      'Stay updated with the latest selected public GitHub repositories and blog posts from Shrijal Acharya.',
    site_url: new URL(BASE_URL).toString(),
    feed_url: new URL('/rss.xml', BASE_URL).toString(),
    image_url: new URL('/images/shrijal-acharya.webp', BASE_URL).toString(),
    author: `${PUBLIC_GMAIL} (Shrijal Acharya)`,
    copyright: `${new Date().getFullYear()} Shrijal Acharya. All rights reserved.`,
    // Expliicitely set the feed date to 'December 4, 2024' as this is the day when the feed is made public.
    pubDate: new Date('2024-12-04T00:00:00Z'),
    language: 'en',
    categories: ['Blogs', 'Projects'],
    generator: 'RSS Feed for Node and Next.js',
    ttl: 60,
  }

  const rss = new RSS({
    ...feedConfig,
    managingEditor: feedConfig.author,
    webMaster: feedConfig.author,
  })

  const createRSSItem = ({
    title,
    description,
    url,
    date,
    author,
    category,
  }: {
    title: string
    description: string
    url: string
    date: Date
    author: string
    category: string
  }) => {
    rss.item({
      title,
      description,
      url,
      date,
      author,
      categories: [category],
    })
  }

  // Add blog posts to RSS feed
  const { blogs } = await getBlogPostsCardMeta({ all: true })
  blogs.forEach(blog => {
    createRSSItem({
      title: blog.title,
      description: blog.brief
        ? blog.brief
        : `${blog.title} blog by Shrijal Acharya`,
      url: new URL(`/blogs/${encodeSourceSlug(blog.source, blog.slug)}`, BASE_URL).toString(),
      date: new Date(blog.publishedAt),
      author: blog.author.name,
      category: 'Blogs',
    })
  })

  const projects = getProjectsMetadata({ all: true })
  projects.forEach(project => {
    createRSSItem({
      title: project.title,
      description:
        project.description ?? `${project.title} project by Shrijal Acharya`,
      url: new URL(`/projects/${project.title}`, BASE_URL).toString(),
      date: new Date(project.updated_at || project.created_at),
      author: project.author ?? 'Shrijal Acharya',
      category: 'Projects',
    })
  })

  const xml = rss.xml()
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}

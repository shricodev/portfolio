import { getAllBlogPosts, encodeSourceSlug } from '@/lib/blogs'
import { BASE_URL, PUBLIC_GMAIL } from '@/lib/constants'
import { cleanDescription, getAllProjects } from '@/lib/projects'
import RSS from 'rss'

// Built once and refreshed hourly instead of on every request.
export const dynamic = 'force-static'
export const revalidate = 3600

// XML 1.0 forbids most control characters, even inside CDATA. One stray
// byte in a post summary would make the whole feed unparseable.
function xmlSafe(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
}

function absolute(path: string): string {
  return new URL(path, BASE_URL).toString()
}

export async function GET() {
  const blogs = await getAllBlogPosts().catch(error => {
    console.error('Failed to fetch blogs for RSS:', error)
    return []
  })
  const projects = getAllProjects()

  const items = [
    ...blogs.map(blog => ({
      title: blog.title,
      description: blog.brief || `${blog.title}, a blog post by Shrijal Acharya`,
      url: absolute(`/blogs/${encodeSourceSlug(blog.source, blog.slug)}`),
      date: new Date(blog.publishedAt),
      category: 'Blogs',
    })),
    ...projects.map(project => ({
      title: project.title,
      description:
        cleanDescription(project.description) ||
        `${project.title}, a project by Shrijal Acharya`,
      url: absolute(`/projects/${project.title}`),
      // created_at never moves, so readers don't see old projects resurface
      date: new Date(project.created_at),
      category: 'Projects',
    })),
  ]
    .filter(item => !Number.isNaN(item.date.getTime()))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const author = `${PUBLIC_GMAIL} (Shrijal Acharya)`
  const feed = new RSS({
    title: 'Shrijal Acharya',
    description:
      'New blog posts and open-source projects from Shrijal Acharya.',
    site_url: absolute('/'),
    feed_url: absolute('/rss.xml'),
    // RSS readers expect PNG, JPEG or GIF here, not WebP
    image_url: absolute('/android-chrome-192x192.png'),
    managingEditor: author,
    webMaster: author,
    copyright: `${new Date().getFullYear()} Shrijal Acharya`,
    pubDate: items[0]?.date ?? new Date(),
    language: 'en',
    categories: ['Blogs', 'Projects'],
    ttl: 60,
  })

  for (const item of items) {
    feed.item({
      title: xmlSafe(item.title),
      description: xmlSafe(item.description),
      url: item.url,
      date: item.date,
      author: 'Shrijal Acharya',
      categories: [item.category],
    })
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      // application/rss+xml makes browsers download the file instead of
      // showing it. Feed readers are happy with plain XML.
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

import { HeroIntro } from '@/components/hero-intro'
import RecentBlogs from '@/components/recent-blogs'
import RecentProjects from '@/components/recent-projects'
import { Socials } from '@/components/socials'
import {
  BASE_URL,
  PAGE_INDEX_DEFAULT,
  RECENT_BLOGS_DEFAULT,
  RECENT_PROJECTS_DEFAULT,
} from '@/lib/constants'
import { getBlogPostsCardMeta } from '@/lib/blogs'
import { getProjectsMetadata } from '@/lib/projects'

import type { Metadata } from 'next'
import { serializeJsonLd } from '@/lib/utils'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Shrijal Acharya',
  url: BASE_URL,
  image: new URL('/images/shrijal-acharya.webp', BASE_URL).toString(),
  jobTitle: 'Developer Advocate and Software Engineer',
  sameAs: [
    'https://www.linkedin.com/in/iamshrijal',
    'https://github.com/shricodev',
    'https://dev.to/shricodev',
    'https://x.com/shricodev',
  ],
  knowsAbout: [
    'TypeScript',
    'Python',
    'Go',
    'Cloud computing',
    'DevOps',
    'AI agents',
  ],
}

export function generateMetadata(): Metadata {
  const baseMetadata = {
    title: 'Shrijal Acharya',
    description:
      'Explore my selected software projects, technical writing, community work, and experience across web development, cloud, DevOps, and AI agents.',
  }

  return {
    ...baseMetadata,
    alternates: {
      canonical: new URL(BASE_URL).toString(),
    },
    openGraph: {
      ...baseMetadata,
      url: new URL(BASE_URL).toString(),
    },
    twitter: {
      ...baseMetadata,
      card: 'summary_large_image',
    },
  }
}

export default async function Home() {
  const { blogs } = await getBlogPostsCardMeta({
    page: PAGE_INDEX_DEFAULT,
    pageSize: RECENT_BLOGS_DEFAULT,
  })
  const recentProjects = getProjectsMetadata({
    page: PAGE_INDEX_DEFAULT,
    perPage: RECENT_PROJECTS_DEFAULT,
  })

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />
      <HeroIntro />

      <RecentBlogs blogPosts={blogs} />

      <RecentProjects projectsMeta={recentProjects} />

      <Socials />
    </>
  )
}

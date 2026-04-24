import { HeroIntro } from '@/components/hero-intro'
import { NewsletterForm } from '@/components/newsletter-form'
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

export function generateMetadata(): Metadata {
  const baseMetadata = {
    title: 'Shrijal Acharya',
    description:
      'Explore my collection of GitHub projects, read my blog posts, and stay updated by subscribing to my newsletter for project and blog updates.',
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

  const recentPosts = getProjectsMetadata({
    page: PAGE_INDEX_DEFAULT,
    perPage: RECENT_PROJECTS_DEFAULT,
  })

  return (
    <>
      <HeroIntro />

      <RecentBlogs blogPosts={blogs} />

      <RecentProjects projectsMeta={recentPosts} />

      <Socials />

      <NewsletterForm />
    </>
  )
}

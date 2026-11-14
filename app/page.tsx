import Link from 'next/link'
import { Hero } from '@/components/hero'
import { SelectedWork } from '@/components/selected-work'
import { getAllBlogPosts } from '@/lib/blogs'
import { getFeaturedPosts } from '@/lib/blogs/featured'
import {
  BASE_URL,
  PUBLIC_GMAIL,
  SITE_DESCRIPTION,
  SOCIAL_LINKS,
} from '@/lib/constants'
import { getAllProjects, getFeaturedProjects, toListItem } from '@/lib/projects'
import { serializeJsonLd } from '@/lib/utils'
import { WORK } from '@/lib/work'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Shrijal Acharya',
    description: SITE_DESCRIPTION,
    url: BASE_URL,
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Shrijal Acharya',
  url: BASE_URL,
  image: new URL('/images/shrijal-acharya.webp', BASE_URL).toString(),
  jobTitle: 'Developer Advocate and Software Engineer',
  worksFor: { '@type': 'Organization', name: 'Composio' },
  sameAs: SOCIAL_LINKS.filter(link => link.footer).map(link => link.href),
  knowsAbout: [
    'TypeScript',
    'Python',
    'Go',
    'AI agents',
    'Developer tooling',
    'DevOps',
    'Cloud computing',
    'Technical writing',
  ],
}

const FEATURED_COUNT = 6
const RECENT_COUNT = 3

export default async function Home() {
  // if both feeds are down the page still renders, just without posts
  const posts = await getAllBlogPosts().catch(() => [])

  const allProjects = getAllProjects()
  const featured = getFeaturedProjects().slice(0, FEATURED_COUNT)
  const featuredNames = new Set(featured.map(project => project.title))
  const recentProjects = allProjects
    .filter(project => !featuredNames.has(project.title))
    .slice(0, RECENT_COUNT)

  // writing: my picks first, then what readers liked, then what's new
  const pickedPosts = getFeaturedPosts(posts).slice(0, FEATURED_COUNT)
  const shown = new Set(pickedPosts.map(post => post.id))
  const popularPosts = [...posts]
    .filter(post => !shown.has(post.id))
    .sort((a, b) => b.reactionsCount - a.reactionsCount)
    .slice(0, RECENT_COUNT)
  popularPosts.forEach(post => shown.add(post.id))
  const recentPosts = posts
    .filter(post => !shown.has(post.id))
    .slice(0, RECENT_COUNT)

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
      />

      <Hero postCount={posts.length} />

      <SelectedWork
        featuredProjects={featured.map(toListItem)}
        recentProjects={recentProjects.map(toListItem)}
        projectCount={allProjects.length}
        pickedPosts={pickedPosts}
        popularPosts={popularPosts}
        recentPosts={recentPosts}
        postCount={posts.length}
      />

      <section aria-labelledby='experience' className='mt-20'>
        <h2 id='experience' className='text-xl font-semibold tracking-tight'>
          Experience
        </h2>
        <ul className='divide-border/60 mt-4 divide-y'>
          {WORK.slice(0, 6).map(entry => (
            <li
              key={entry.org}
              className='flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4'
            >
              <span className='text-[15px]'>
                <span className='font-medium'>{entry.role}</span>
                <span className='text-muted-foreground'>, {entry.org}</span>
              </span>
              <span className='text-muted-foreground shrink-0 font-mono text-xs'>
                {entry.start} to {entry.end}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href='/work'
          className='text-muted-foreground hover:text-foreground mt-5 inline-block text-sm underline underline-offset-4'
        >
          What I did in each role
        </Link>
      </section>

      <section aria-labelledby='elsewhere' className='mt-20'>
        <h2 id='elsewhere' className='text-xl font-semibold tracking-tight'>
          Elsewhere
        </h2>
        <p className='text-muted-foreground mt-3 max-w-2xl leading-7'>
          Open to full-time roles, freelance work, and collaborations. Email{' '}
          <a
            href={`mailto:${PUBLIC_GMAIL}`}
            className='text-foreground underline underline-offset-4'
          >
            {PUBLIC_GMAIL}
          </a>
          , use the{' '}
          <Link
            href='/contact'
            className='text-foreground underline underline-offset-4'
          >
            contact form
          </Link>
          , or find me here:
        </p>
        <ul className='mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm'>
          {SOCIAL_LINKS.map(link => (
            <li key={link.name}>
              <a
                href={link.href}
                target='_blank'
                rel='noreferrer noopener me'
                className='text-muted-foreground hover:text-foreground underline-offset-4 hover:underline'
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

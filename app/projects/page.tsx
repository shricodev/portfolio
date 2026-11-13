import { ProjectList, ProjectListFromUrl } from '@/components/project-list'
import { BASE_URL, GITHUB_URL } from '@/lib/constants'
import { getAllProjects, toListItem } from '@/lib/projects'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Open-source projects by Shrijal Acharya: AI agents, developer tools, CLIs, and full-stack apps.',
  alternates: {
    canonical: new URL('/projects', BASE_URL).toString(),
  },
}

export default function Page() {
  const projects = getAllProjects().map(toListItem)

  return (
    <section>
      <h1 className='title'>Projects</h1>
      <p className='lede'>
        AI agents, developer tools, CLIs, and full-stack apps I have built in
        the open. This is a selection, the rest is on{' '}
        <a
          href={GITHUB_URL}
          target='_blank'
          rel='noreferrer noopener'
          className='text-foreground underline underline-offset-4'
        >
          GitHub
        </a>
        .
      </p>

      <div className='mt-10'>
        <Suspense fallback={<ProjectList projects={projects} />}>
          <ProjectListFromUrl projects={projects} />
        </Suspense>
      </div>
    </section>
  )
}

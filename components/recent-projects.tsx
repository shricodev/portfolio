import Link from 'next/link'
import { Projects } from '@/components/projects'
import { TProjectMetadata } from '@/types/projects'

interface RecentProjectsProps {
  projectsMeta: TProjectMetadata[]
}

export default function RecentProjects({
  projectsMeta,
}: RecentProjectsProps) {
  return (
    <section className='my-16' aria-labelledby='recent-projects-heading'>
      <h2 id='recent-projects-heading' className='title'>
        Recent projects
      </h2>
      <Projects projectsMeta={projectsMeta} />

      <Link
        href='/projects'
        className='mt-8 inline-flex items-center gap-2 text-sm font-semibold'
      >
        <span className='text-muted-foreground hover:text-foreground underline underline-offset-4 hover:transition'>
          All projects
        </span>
      </Link>
    </section>
  )
}

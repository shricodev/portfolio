import Link from 'next/link'
import { TProjectMetadata } from '@/types/projects'
import { Projects } from '@/components/projects'

interface RecentProjectsProps {
  projectsMeta: TProjectMetadata[]
}

export default function RecentPosts({ projectsMeta }: RecentProjectsProps) {
  return (
    <section className='my-16'>
      <h2 className='title'>Recent projects</h2>
      <Projects projectsMeta={projectsMeta} />

      <Link
        href='/projects'
        className='mt-8 inline-flex items-center gap-2 text-sm font-semibold'
      >
        <span className='text-muted-foreground underline underline-offset-4 hover:text-foreground hover:transition'>
          All projects
        </span>
      </Link>
    </section>
  )
}

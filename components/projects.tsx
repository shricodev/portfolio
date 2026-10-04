import { ProjectCard } from '@/components/project-card'
import { SEARCH_QUERY_PARAM } from '@/lib/constants'
import { TProjectMetadata } from '@/types/projects'

interface ProjectsProps {
  projectsMeta: TProjectMetadata[]
  searchParams?: {
    [SEARCH_QUERY_PARAM]?: string
  }
}

export const Projects = ({ projectsMeta, searchParams }: ProjectsProps) => {
  if (projectsMeta.length === 0) {
    return (
      <p className='text-muted-foreground text-sm font-medium'>
        No results found
      </p>
    )
  }

  return (
    <ul className='flex flex-col gap-8'>
      {projectsMeta.map(projectMeta => (
        <li key={`${projectMeta.title}_${projectMeta.created_at}`}>
          <ProjectCard
            projectMetadata={projectMeta}
            searchParams={searchParams}
          />
        </li>
      ))}
    </ul>
  )
}

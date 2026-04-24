import { TProjectMetadata } from '@/types/projects'
import { ProjectCard } from '@/components/project-card'
import { SEARCH_QUERY_PARAM } from '@/lib/constants'

interface ProjectsProps {
  projectsMeta: TProjectMetadata[]
  searchParams?: {
    [SEARCH_QUERY_PARAM]?: string
  }
}

export const Projects = ({ projectsMeta, searchParams }: ProjectsProps) => {
  return (
    <>
      {projectsMeta.length === 0 ? (
        <p className='text-sm font-medium text-muted-foreground'>
          No results found
        </p>
      ) : (
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
      )}
    </>
  )
}

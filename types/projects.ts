export type TProject = {
  metadata: TProjectMetadata
  content: string
}

export type TProjectMetadata = {
  title: string
  description?: string
  author?: string
  clone_url: string
  language?: string
  homepage?: string
  topics?: string[]
  created_at: string
  updated_at?: string
}

// trimmed-down shape sent to the client list
export type TProjectListItem = {
  title: string
  description: string
  language: string
  homepage: string
  repo: string
  year: string
  topics: string[]
  featured: boolean
}

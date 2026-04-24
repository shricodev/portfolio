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

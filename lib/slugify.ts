import GithubSlugger from 'github-slugger'

export function createSlugger() {
  const slugger = new GithubSlugger()
  return (raw: string): string => slugger.slug(raw)
}

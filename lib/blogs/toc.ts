import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import type { Heading, Root, PhrasingContent } from 'mdast'
import { createSlugger } from '@/lib/slugify'

export interface TocItem {
  depth: 2 | 3 | 4
  value: string
  id: string
}

function nodeText(node: PhrasingContent | Heading): string {
  if ('value' in node && typeof node.value === 'string') return node.value
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(child => nodeText(child as PhrasingContent)).join('')
  }
  return ''
}

export function extractToc(markdown: string): TocItem[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown) as Root

  const slug = createSlugger()
  const items: TocItem[] = []

  visit(tree, 'heading', (node: Heading) => {
    if (node.depth < 2 || node.depth > 4) return
    const text = nodeText(node).trim()
    if (!text) return
    items.push({
      depth: node.depth as 2 | 3 | 4,
      value: text,
      id: slug(text),
    })
  })

  return items
}

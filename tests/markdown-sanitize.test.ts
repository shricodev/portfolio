import { describe, expect, test } from 'bun:test'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element } from 'hast'
import { MARKDOWN_SANITIZE_SCHEMA } from '@/lib/markdown-sanitize'

function sanitize(source: string): Element[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, MARKDOWN_SANITIZE_SCHEMA)
  const tree = processor.runSync(processor.parse(source))
  const elements: Element[] = []
  visit(tree, 'element', node => elements.push(node))
  return elements
}

describe('remote Markdown sanitization', () => {
  test('removes scripts and unsafe URL protocols', () => {
    const elements = sanitize(
      '<script>alert(1)</script><a href="javascript:alert(1)">bad</a>',
    )

    expect(elements.some(node => node.tagName === 'script')).toBe(false)
    const link = elements.find(node => node.tagName === 'a')
    expect(link?.properties.href).toBeUndefined()
  })

  test('preserves trusted internal embed placeholders', () => {
    const elements = sanitize(
      '<embed-youtube data-arg="https://youtu.be/example"></embed-youtube>',
    )

    expect(elements).toContainEqual(
      expect.objectContaining({
        tagName: 'embed-youtube',
        properties: expect.objectContaining({
          dataArg: 'https://youtu.be/example',
        }),
      }),
    )
  })
})

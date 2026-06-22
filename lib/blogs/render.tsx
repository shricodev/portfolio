import * as prod from 'react/jsx-runtime'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeReact, { type Options as RehypeReactOptions } from 'rehype-react'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Element, Root } from 'hast'
import type { ComponentProps, ReactNode } from 'react'
import { PRETTY_CODE_OPTIONS } from '@/lib/mdx-options'
import {
  FallbackLink,
  TweetEmbed,
  YouTubeEmbed,
} from '@/components/mdx/embeds'
import { EmbedBoundary } from '@/components/mdx/embed-boundary'
import { ZoomableImage } from '@/components/mdx/zoomable-image'
import { CodeBlock } from '@/components/mdx/code-block'
import { remarkDevtoEmbeds } from '@/lib/blogs/remark-devto-embeds'
import { createSlugger } from '@/lib/slugify'

export interface TocItem {
  depth: 2 | 3 | 4
  value: string
  id: string
}

const HEADING_TAGS = new Set(['h2', 'h3', 'h4'])

// Dev.to and Hashnode both emit `![alt](url align="center")` which violates
// CommonMark image syntax (unquoted attrs after the destination). Strip the
// align attribute so the image actually parses.
const IMAGE_ALIGN_RE = /(!\[[^\]]*]\([^)]*?)\s+align="[^"]*"(\s*\))/g

function normalizeBlogMarkdown(raw: string): string {
  return raw.replace(IMAGE_ALIGN_RE, '$1$2')
}

function readDataAttr(props: Record<string, unknown>, key: string): string {
  const value = props[key]
  return typeof value === 'string' ? value : ''
}

const EMBED_COMPONENTS = {
  'embed-youtube': (props: Record<string, unknown>) => {
    const id = readDataAttr(props, 'data-arg')
    return (
      <EmbedBoundary fallback={<FallbackLink kind='link' target={id} />}>
        <YouTubeEmbed id={id} />
      </EmbedBoundary>
    )
  },
  'embed-tweet': (props: Record<string, unknown>) => {
    const id = readDataAttr(props, 'data-arg')
    const tweetId = id.replace(/[^\d]/g, '')
    return (
      <EmbedBoundary
        fallback={
          <FallbackLink
            kind='tweet'
            target={
              tweetId ? `https://x.com/i/status/${tweetId}` : id
            }
          />
        }
      >
        <TweetEmbed id={id} />
      </EmbedBoundary>
    )
  },
  'embed-fallback': (props: Record<string, unknown>) => {
    const kind = readDataAttr(props, 'data-kind')
    const target = readDataAttr(props, 'data-target')
    return (
      <EmbedBoundary fallback={<FallbackLink kind={kind} target={target} />}>
        <FallbackLink kind={kind} target={target} />
      </EmbedBoundary>
    )
  },
}

function ExternalAnchor(props: ComponentProps<'a'>) {
  return (
    <a
      {...props}
      target='_blank'
      rel='noopener noreferrer'
      className='underline underline-offset-4'
    />
  )
}

// Walks heading elements once: assigns a stable, unique id and pushes a TOC
// entry. Both outputs come from the same tree walk and the same slugger, so
// the rendered hash anchors and the sidebar entries can never drift apart.
function rehypeCollectHeadings(toc: TocItem[]) {
  return () => (tree: Root) => {
    const slug = createSlugger()
    visit(tree, 'element', (node: Element) => {
      if (!HEADING_TAGS.has(node.tagName)) return
      const text = toString(node).trim()
      if (!text) return
      const id = slug(text)
      node.properties = { ...(node.properties ?? {}), id }
      toc.push({
        depth: Number(node.tagName[1]) as 2 | 3 | 4,
        value: text,
        id,
      })
    })
  }
}

export interface RenderedBlog {
  content: ReactNode
  toc: TocItem[]
}

export async function renderBlogContent(source: string): Promise<RenderedBlog> {
  const toc: TocItem[] = []

  const rehypeReactOptions: RehypeReactOptions = {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components: {
      a: ExternalAnchor,
      img: ZoomableImage,
      figure: CodeBlock,
      ...EMBED_COMPONENTS,
    },
  }

  try {
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkUnwrapImages)
      .use(remarkDevtoEmbeds)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeCollectHeadings(toc))
      .use(rehypePrettyCode, PRETTY_CODE_OPTIONS)
      .use(rehypeReact, rehypeReactOptions)
      .process(normalizeBlogMarkdown(source))

    return { content: file.result as ReactNode, toc }
  } catch (error) {
    console.error('Blog markdown render failed', error)
    return {
      content: (
        <div className='rounded-md border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-muted-foreground'>
          This content could not be rendered. View the original source for full
          fidelity.
        </div>
      ),
      toc: [],
    }
  }
}

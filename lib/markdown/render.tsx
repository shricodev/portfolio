import * as prod from 'react/jsx-runtime'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeReact, { type Options as RehypeReactOptions } from 'rehype-react'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Element, Root } from 'hast'
import { Suspense, type ComponentProps, type ReactNode } from 'react'
import { PRETTY_CODE_OPTIONS } from '@/lib/mdx-options'
import { FallbackLink, TweetEmbed, YouTubeEmbed } from '@/components/mdx/embeds'
import { EmbedBoundary } from '@/components/mdx/embed-boundary'
import { MarkdownImage } from '@/components/mdx/markdown-image'
import { CodeBlock } from '@/components/mdx/code-block'
import { remarkDevtoEmbeds } from '@/lib/blogs/remark-devto-embeds'
import { rehypeMedia } from '@/lib/markdown/rehype-media'
import { createSlugger } from '@/lib/slugify'
import { MARKDOWN_SANITIZE_SCHEMA } from '@/lib/markdown-sanitize'
import { canOptimizeImage } from '@/lib/image-hosts'

export interface TocItem {
  depth: 2 | 3 | 4
  value: string
  id: string
}

export interface RenderedMarkdown {
  content: ReactNode
  toc: TocItem[]
}

interface RenderOptions {
  // blog posts get DEV/Hashnode embed handling
  embeds?: boolean
  // GitHub repo name, used to resolve relative README links and images
  repo?: string
}

const HEADING_RE = /^h[1-6]$/
const TOC_TAGS = new Set(['h2', 'h3', 'h4'])

// Dev.to and Hashnode both emit `![alt](url align="center")` which isn't
// valid markdown. Drop the align bit so the image actually parses.
const IMAGE_ALIGN_RE = /(!\[[^\]]*]\([^)]*?)\s+align="[^"]*"(\s*\))/g

function readProp(props: Record<string, unknown>, key: string): string {
  const value = props[key]
  return typeof value === 'string' ? value : ''
}

const EMBED_COMPONENTS = {
  'embed-youtube': (props: Record<string, unknown>) => {
    const id = readProp(props, 'data-arg')
    return (
      <EmbedBoundary fallback={<FallbackLink kind='link' target={id} />}>
        <YouTubeEmbed id={id} />
      </EmbedBoundary>
    )
  },
  'embed-tweet': (props: Record<string, unknown>) => {
    const id = readProp(props, 'data-arg')
    const tweetId = id.replace(/[^\d]/g, '')
    return (
      <EmbedBoundary
        fallback={
          <FallbackLink
            kind='tweet'
            target={tweetId ? `https://x.com/i/status/${tweetId}` : id}
          />
        }
      >
        {/* a slow tweet shouldn't hold up the whole article */}
        <Suspense
          fallback={
            <div className='not-prose border-border my-6 h-48 rounded-md border' />
          }
        >
          <TweetEmbed id={id} />
        </Suspense>
      </EmbedBoundary>
    )
  },
  'embed-fallback': (props: Record<string, unknown>) => (
    <FallbackLink
      kind={readProp(props, 'data-kind')}
      target={readProp(props, 'data-target')}
    />
  ),
}

function Anchor({ href, ...props }: ComponentProps<'a'>) {
  const hrefStr = String(href ?? '')
  const className = 'underline underline-offset-4'
  // same-page links scroll in place, everything else opens in a new tab
  if (hrefStr.startsWith('#')) {
    return <a {...props} href={hrefStr} className={className} />
  }
  return (
    <a
      {...props}
      href={hrefStr}
      target='_blank'
      rel='noopener noreferrer'
      className={className}
    />
  )
}

function toCssLength(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const text = String(value).trim()
  if (/^\d+(\.\d+)?$/.test(text)) return `${text}px`
  if (/^\d+(\.\d+)?(px|%|em|rem)$/.test(text)) return text
  return undefined
}

function toNumber(value: string): number | undefined {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function Img(props: Record<string, unknown>) {
  const src = readProp(props, 'src')
  const alt = readProp(props, 'alt')
  const kind = readProp(props, 'data-kind')

  if (kind === 'missing' || !src) {
    return (
      <span className='border-border text-muted-foreground my-2 inline-block rounded-md border border-dashed px-3 py-2 text-xs'>
        Image unavailable{alt ? `: ${alt}` : ''}
      </span>
    )
  }

  return (
    <MarkdownImage
      src={src}
      alt={alt}
      kind={kind === 'badge' || kind === 'inline' ? kind : 'block'}
      intrinsicWidth={toNumber(readProp(props, 'data-w'))}
      intrinsicHeight={toNumber(readProp(props, 'data-h'))}
      cssWidth={toCssLength(props.width)}
      cssHeight={toCssLength(props.height)}
      optimize={canOptimizeImage(src)}
      zoomable={kind !== 'badge' && props['data-linked'] !== 'true'}
    />
  )
}

// One walk over the headings: gives each a stable id and collects the TOC,
// so anchors and the sidebar can never drift apart.
function rehypeCollectHeadings(toc: TocItem[]) {
  return () => (tree: Root) => {
    const slug = createSlugger()
    visit(tree, 'element', (node: Element) => {
      if (!HEADING_RE.test(node.tagName)) return
      const text = toString(node).trim()
      if (!text) return
      const id = slug(text)
      node.properties = { ...(node.properties ?? {}), id }
      if (TOC_TAGS.has(node.tagName)) {
        toc.push({
          depth: Number(node.tagName[1]) as 2 | 3 | 4,
          value: text,
          id,
        })
      }
    })
  }
}

// Wide tables scroll sideways instead of breaking the page on mobile.
function Table(props: ComponentProps<'table'>) {
  return (
    <div className='my-6 overflow-x-auto'>
      <table {...props} className='my-0' />
    </div>
  )
}

export async function renderMarkdown(
  source: string,
  { embeds = false, repo }: RenderOptions = {},
): Promise<RenderedMarkdown> {
  const toc: TocItem[] = []

  const rehypeReactOptions: RehypeReactOptions = {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components: {
      a: Anchor,
      img: Img,
      figure: CodeBlock,
      table: Table,
      ...(embeds ? EMBED_COMPONENTS : {}),
    },
  }

  try {
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(embeds ? [remarkDevtoEmbeds] : [])
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeUnwrapImages)
      .use(rehypeSanitize, MARKDOWN_SANITIZE_SCHEMA)
      .use(rehypeMedia({ repo }))
      .use(rehypeCollectHeadings(toc))
      .use(rehypePrettyCode, PRETTY_CODE_OPTIONS)
      .use(rehypeReact, rehypeReactOptions)
      .process(embeds ? source.replace(IMAGE_ALIGN_RE, '$1$2') : source)

    return { content: file.result as ReactNode, toc }
  } catch (error) {
    console.error('Markdown render failed', error)
    return {
      content: (
        <div className='border-destructive/50 bg-destructive/5 text-muted-foreground rounded-md border px-4 py-3 text-sm'>
          This content could not be rendered. View the original source for full
          fidelity.
        </div>
      ),
      toc: [],
    }
  }
}

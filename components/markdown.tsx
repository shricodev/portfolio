import * as prod from 'react/jsx-runtime'
import { unified, type PluggableList } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeReact, { type Options as RehypeReactOptions } from 'rehype-react'
import type { ComponentProps, ReactNode } from 'react'
import { PRETTY_CODE_OPTIONS } from '@/lib/mdx-options'
import {
  FallbackLink,
  TweetEmbed,
  YouTubeEmbed,
} from '@/components/mdx/embeds'
import { ZoomableImage } from '@/components/mdx/zoomable-image'

interface MarkdownProps {
  source: string
  projectName?: string
  remarkPlugins?: PluggableList
  withDevtoEmbeds?: boolean
}

type AnchorProps = ComponentProps<'a'> & { projectName?: string }

function CustomAnchor({ projectName, href, ...props }: AnchorProps) {
  const hrefStr = String(href ?? '')
  if (hrefStr.startsWith('#') && projectName) {
    return (
      <a
        {...props}
        target='_blank'
        href={`https://github.com/shricodev/${projectName}/${hrefStr}`}
        className='underline underline-offset-4'
      />
    )
  }
  return (
    <a
      {...props}
      href={hrefStr}
      target='_blank'
      rel='noopener noreferrer'
      className='underline underline-offset-4'
    />
  )
}

function readDataAttr(props: Record<string, unknown>, key: string): string {
  const value = props[key]
  return typeof value === 'string' ? value : ''
}

const EMBED_COMPONENTS = {
  'embed-youtube': (props: Record<string, unknown>) => (
    <YouTubeEmbed id={readDataAttr(props, 'data-arg')} />
  ),
  'embed-tweet': (props: Record<string, unknown>) => (
    <TweetEmbed id={readDataAttr(props, 'data-arg')} />
  ),
  'embed-fallback': (props: Record<string, unknown>) => (
    <FallbackLink
      kind={readDataAttr(props, 'data-kind')}
      target={readDataAttr(props, 'data-target')}
    />
  ),
}

// Dev.to and Hashnode both emit `![alt](url align="center")` which violates
// CommonMark image syntax (unquoted attrs after the destination). Strip the
// align attribute so the image actually parses.
const IMAGE_ALIGN_RE = /(!\[[^\]]*]\([^)]*?)\s+align="[^"]*"(\s*\))/g

function normalizeBlogMarkdown(raw: string): string {
  return raw.replace(IMAGE_ALIGN_RE, '$1$2')
}

export default async function Markdown({
  source,
  projectName,
  remarkPlugins = [],
  withDevtoEmbeds = false,
}: MarkdownProps): Promise<ReactNode> {
  const normalized = withDevtoEmbeds ? normalizeBlogMarkdown(source) : source
  const components = {
    a: (props: ComponentProps<'a'>) => (
      <CustomAnchor {...props} projectName={projectName} />
    ),
    img: ZoomableImage,
    ...(withDevtoEmbeds ? EMBED_COMPONENTS : {}),
  }

  const rehypeReactOptions: RehypeReactOptions = {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components,
  }

  try {
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkUnwrapImages)
      .use(remarkPlugins)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypePrettyCode, PRETTY_CODE_OPTIONS)
      .use(rehypeReact, rehypeReactOptions)
      .process(normalized)

    return file.result as ReactNode
  } catch (error) {
    console.error('Markdown render failed', error)
    return (
      <div className='rounded-md border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-muted-foreground'>
        This content could not be rendered. View the original source for full
        fidelity.
      </div>
    )
  }
}

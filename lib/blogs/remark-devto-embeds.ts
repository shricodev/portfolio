import type { Plugin } from 'unified'
import type { Html, Paragraph, PhrasingContent, Root } from 'mdast'
import { visit, SKIP } from 'unist-util-visit'

const LIQUID_LINE_RE = /^\{%\s*(\w+)\s+([^%]+?)\s*%\}$/
const ACORN_LINE_RE = /^%\[(.+?)\]$/

const LIQUID_EMBEDS: Record<string, string> = {
  youtube: 'embed-youtube',
  twitter: 'embed-tweet',
  tweet: 'embed-tweet',
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Route a raw URL to a typed embed component when the host is YouTube or
// Twitter. Used for `%[url]` (Hashnode oEmbed) and generic liquid kinds like
// `{% embed url %}` / `{% link url %}`. All other hosts fall through to the
// FallbackLink card.
function detectEmbedFromUrl(
  raw: string,
): { tag: string; arg: string } | null {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\./, '').toLowerCase()

  if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com')
    return { tag: 'embed-youtube', arg: raw }
  if (host === 'twitter.com' || host === 'x.com' || host === 'mobile.twitter.com') {
    const match = parsed.pathname.match(/status\/(\d+)/)
    if (match) return { tag: 'embed-tweet', arg: match[1] }
  }
  return null
}

function buildEmbedHtml(kind: string, arg: string): string {
  const explicitTag = LIQUID_EMBEDS[kind]
  if (explicitTag) {
    return `<${explicitTag} data-arg="${escapeAttr(arg)}"></${explicitTag}>`
  }
  if (/^https?:\/\//i.test(arg)) {
    const detected = detectEmbedFromUrl(arg)
    if (detected) {
      return `<${detected.tag} data-arg="${escapeAttr(detected.arg)}"></${detected.tag}>`
    }
  }
  return `<embed-fallback data-kind="${escapeAttr(kind)}" data-target="${escapeAttr(arg)}"></embed-fallback>`
}

// Reconstruct the paragraph's raw text across all children. Bare URLs inside
// `{% ... %}` are parsed by remark as autolinks (Link nodes), so a single-child
// check would miss them. We splice URL values back in by walking the children.
function phrasingToRaw(children: readonly PhrasingContent[]): string | null {
  let out = ''
  for (const child of children) {
    if (child.type === 'text') {
      out += child.value
    } else if (child.type === 'link') {
      const inner = phrasingToRaw(child.children)
      if (inner && inner !== child.url) {
        out += inner
      } else {
        out += child.url
      }
    } else {
      return null
    }
  }
  return out
}

/**
 * Transforms Dev.to-flavored shortcodes into custom HTML element nodes:
 *   {% youtube ID %}  →  <embed-youtube data-arg="ID"></embed-youtube>
 *   {% github user %}  →  <embed-fallback data-kind="github" data-target="user"></embed-fallback>
 *   %[url]             →  <embed-fallback data-kind="acorn" data-target="url"></embed-fallback>
 *
 * Downstream: `rehype-raw` parses these into hast nodes, and the unified
 * pipeline routes each custom tag to its React component via rehype-react.
 */
export const remarkDevtoEmbeds: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (!parent || typeof index !== 'number') return
      const raw = phrasingToRaw(node.children)?.trim()
      if (!raw) return

      const liquid = raw.match(LIQUID_LINE_RE)
      if (liquid) {
        const [, kind, arg] = liquid
        const htmlNode: Html = {
          type: 'html',
          value: buildEmbedHtml(kind.toLowerCase(), arg.trim()),
        }
        parent.children.splice(index, 1, htmlNode)
        return [SKIP, index + 1]
      }

      const acorn = raw.match(ACORN_LINE_RE)
      if (acorn) {
        const inner = acorn[1].trim()
        if (/^https?:\/\//.test(inner)) {
          const htmlNode: Html = {
            type: 'html',
            value: buildEmbedHtml('acorn', inner),
          }
          parent.children.splice(index, 1, htmlNode)
        } else {
          parent.children.splice(index, 1)
        }
        return [SKIP, index]
      }
    })
  }
}

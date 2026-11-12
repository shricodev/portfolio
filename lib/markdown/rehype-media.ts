import { visit } from 'unist-util-visit'
import type { Element, ElementContent, Root } from 'hast'
import { probeImageSize } from '@/lib/image-size'

const GITHUB_USER = 'shricodev'
const ABSOLUTE_RE = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i
const BADGE_RE =
  /img\.shields\.io|badgen\.net|badge\.fury\.io|\/badge\.svg|\/badges\/|github\.com\/[^/]+\/[^/]+\/(?:actions\/)?workflows\/.+\.svg/i
const BLOB_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/

function cleanPath(value: string): string {
  return value.replace(/^\.?\/+/, '')
}

function resolveImageSrc(src: string, repo?: string): string | null {
  const blob = src.match(BLOB_RE)
  if (blob) {
    const [, owner, name, rest] = blob
    return `https://raw.githubusercontent.com/${owner}/${name}/${rest.replace(/\?raw=true$/, '')}`
  }
  if (ABSOLUTE_RE.test(src)) return src
  // relative path in a README, point it at the repo
  if (!repo) return null
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/HEAD/${cleanPath(src)}`
}

function resolveHref(href: string, repo?: string): string {
  if (!repo || href.startsWith('#') || ABSOLUTE_RE.test(href)) return href
  return `https://github.com/${GITHUB_USER}/${repo}/blob/HEAD/${cleanPath(href)}`
}

function isMeaningful(node: ElementContent): boolean {
  if (node.type === 'text') return node.value.trim().length > 0
  if (node.type === 'element') return node.tagName !== 'br'
  return false
}

// Fixes up links and images after sanitizing: resolves relative URLs, tags
// badges, and records the real image size so nothing gets stretched.
export function rehypeMedia({ repo }: { repo?: string } = {}) {
  return () => async (tree: Root) => {
    const jobs: Promise<void>[] = []

    visit(tree, 'element', (node: Element, _index, parent) => {
      if (node.tagName === 'a' && typeof node.properties.href === 'string') {
        node.properties.href = resolveHref(node.properties.href, repo)
        return
      }
      if (node.tagName !== 'img') return

      const rawSrc = String(node.properties.src ?? '').trim()
      const src = rawSrc ? resolveImageSrc(rawSrc, repo) : null
      if (!src) {
        node.properties.dataKind = 'missing'
        return
      }
      node.properties.src = src

      if (BADGE_RE.test(src)) {
        node.properties.dataKind = 'badge'
        return
      }

      const parentEl = parent?.type === 'element' ? parent : null
      const siblings = (parentEl?.children ?? []).filter(
        child => child !== node && isMeaningful(child),
      )
      const linked = parentEl?.tagName === 'a'
      node.properties.dataKind =
        linked || siblings.length > 0 ? 'inline' : 'block'
      if (linked) node.properties.dataLinked = 'true'

      jobs.push(
        probeImageSize(src).then(result => {
          if (result.status === 'missing') {
            node.properties.dataKind = 'missing'
          } else if (result.status === 'ok') {
            node.properties.dataW = String(result.width)
            node.properties.dataH = String(result.height)
          }
        }),
      )
    })

    await Promise.all(jobs)
  }
}

import { imageSize } from 'image-size'
import { createLimiter } from '@/lib/blogs/limit'

export type ProbedImage =
  | { status: 'ok'; width: number; height: number }
  | { status: 'missing' }
  | { status: 'unknown' }

const limit = createLimiter(8)
const memo = new Map<string, Promise<ProbedImage>>()

// Headers of pretty much every format fit in the first 64kb.
const PROBE_BYTES = 65_535

async function probe(src: string): Promise<ProbedImage> {
  try {
    const response = await fetch(src, {
      headers: { Range: `bytes=0-${PROBE_BYTES}` },
      signal: AbortSignal.timeout(5_000),
      next: { revalidate: 60 * 60 * 24 * 7 },
    })
    if (response.status === 404 || response.status === 410) {
      return { status: 'missing' }
    }
    if (!response.ok) return { status: 'unknown' }

    const bytes = new Uint8Array(await response.arrayBuffer())
    const { width, height } = imageSize(bytes.subarray(0, PROBE_BYTES + 1))
    if (!width || !height) return { status: 'unknown' }
    return { status: 'ok', width, height }
  } catch {
    // timeout, unsupported format, truncated header... just render unsized
    return { status: 'unknown' }
  }
}

// Reads the real pixel size of a remote image so we can reserve its space
// and never upscale it.
export function probeImageSize(src: string): Promise<ProbedImage> {
  if (!/^https?:\/\//.test(src)) return Promise.resolve({ status: 'unknown' })
  let pending = memo.get(src)
  if (!pending) {
    pending = limit(() => probe(src))
    memo.set(src, pending)
  }
  return pending
}

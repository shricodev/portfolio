import { imageSize } from 'image-size'
import { createLimiter } from '@/lib/blogs/limit'

type Dims = { width: number; height: number }

const dimsCache = new Map<string, Dims | null>()
const inFlight = new Map<string, Promise<Dims | null>>()
const probeLimit = createLimiter(8)

// PNG, JPEG, GIF, WebP, AVIF all carry dimensions in their header,
// well within the first 64 KB. Fetching only this prefix keeps responses
// under Next's 2 MB data cache limit and avoids hauling multi-MB GIFs
// just to read the size.
const PROBE_BYTES = 64 * 1024

export async function probeCoverDimensions(
  url: string | undefined,
): Promise<Dims | null> {
  if (!url) return null
  if (dimsCache.has(url)) return dimsCache.get(url) ?? null

  const existing = inFlight.get(url)
  if (existing) return existing

  const promise = probeLimit(async (): Promise<Dims | null> => {
    try {
      // Range keeps each response well under Next's 2 MB data cache
      // limit, and `revalidate` opts the fetch back into the cache so
      // calling routes (sitemap, blog list) stay statically renderable.
      const res = await fetch(url, {
        headers: { Range: `bytes=0-${PROBE_BYTES - 1}` },
        next: { revalidate: 86400 },
      })
      if (!res.ok) return null
      const buf = new Uint8Array(await res.arrayBuffer())
      const meta = imageSize(buf)
      if (!meta.width || !meta.height) return null
      return { width: meta.width, height: meta.height }
    } catch (err) {
      console.error(`Failed to probe cover image ${url}:`, err)
      return null
    }
  })

  inFlight.set(url, promise)
  try {
    const dims = await promise
    dimsCache.set(url, dims)
    return dims
  } finally {
    inFlight.delete(url)
  }
}

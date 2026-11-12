// Hosts we let next/image optimize. Anything else renders as a plain <img>,
// so the optimizer can't be used as an open proxy.
export const OPTIMIZED_IMAGE_HOSTS = [
  'raw.githubusercontent.com',
  'user-images.githubusercontent.com',
  'camo.githubusercontent.com',
  'github.com',
  'media.dev.to',
  'media2.dev.to',
  'dev-to-uploads.s3.amazonaws.com',
  'res.cloudinary.com',
  'cdn.hashnode.com',
  'cdn.freecodecamp.org',
  'www.freecodecamp.org',
  'i.imgur.com',
]

export function canOptimizeImage(src: string): boolean {
  if (src.startsWith('/')) return true
  try {
    const url = new URL(src)
    if (url.protocol !== 'https:') return false
    if (/\.(gif|svg)$/i.test(url.pathname)) return false
    return OPTIMIZED_IMAGE_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

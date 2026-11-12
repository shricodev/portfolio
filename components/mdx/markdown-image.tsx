'use client'

import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import { useCallback, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export interface MarkdownImageProps {
  src: string
  alt: string
  kind: 'badge' | 'inline' | 'block'
  // real pixel size, when we could read it
  intrinsicWidth?: number
  intrinsicHeight?: number
  // what the author asked for, e.g. width="250" or width="45%"
  cssWidth?: string
  cssHeight?: string
  optimize: boolean
  zoomable: boolean
}

function Broken({ alt }: { alt: string }) {
  return (
    <span className='border-border text-muted-foreground my-2 inline-block rounded-md border border-dashed px-3 py-2 text-xs'>
      Image unavailable{alt ? `: ${alt}` : ''}
    </span>
  )
}

export function MarkdownImage({
  src,
  alt,
  kind,
  intrinsicWidth,
  intrinsicHeight,
  cssWidth,
  cssHeight,
  optimize,
  zoomable,
}: MarkdownImageProps) {
  const [failed, setFailed] = useState(false)

  // catches images that already failed before hydration
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) setFailed(true)
  }, [])

  if (failed) return kind === 'badge' ? null : <Broken alt={alt} />

  if (kind === 'badge') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading='lazy'
        decoding='async'
        onError={() => setFailed(true)}
        className='my-0 inline-block max-w-full align-middle'
        style={{ height: cssHeight }}
      />
    )
  }

  const hasSize = Boolean(intrinsicWidth && intrinsicHeight)
  // never wider than the real image, never wider than the column
  const style: CSSProperties = {
    width: cssWidth ?? (hasSize ? intrinsicWidth : undefined),
    maxWidth: '100%',
    height: 'auto',
  }
  const className = cn(
    'my-0 rounded-md',
    kind === 'block' ? 'mx-auto block' : 'inline-block align-middle',
  )

  const pixelWidth = cssWidth?.endsWith('px')
    ? Number.parseInt(cssWidth, 10)
    : (intrinsicWidth ?? 736)

  const image =
    optimize && hasSize ? (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        sizes={`(max-width: 768px) 100vw, ${Math.min(pixelWidth, 736)}px`}
        onError={() => setFailed(true)}
        className={className}
        style={style}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        loading='lazy'
        decoding='async'
        onError={() => setFailed(true)}
        className={className}
        style={style}
      />
    )

  if (!zoomable) return image

  return (
    <Zoom zoomMargin={24} wrapElement='span'>
      {image}
    </Zoom>
  )
}

'use client'

import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import type { ComponentProps } from 'react'

export function ZoomableImage(props: ComponentProps<'img'>) {
  const imageSrc = String(props.src ?? '').trim()
  if (!imageSrc) return null
  if (imageSrc.includes('img.shields.io')) return null
  if (imageSrc.startsWith('.'))
    return (
      <span className='my-2 flex justify-center bg-zinc-50 p-10 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'>
        <strong>404</strong>: Oops, image not found!
      </span>
    )
  return (
    <Zoom zoomMargin={24}>
      <Image
        src={imageSrc}
        width={700}
        height={400}
        unoptimized={imageSrc.toLowerCase().endsWith('.gif')}
        alt={props.alt ?? 'Image'}
        className='mx-auto rounded-md'
      />
    </Zoom>
  )
}

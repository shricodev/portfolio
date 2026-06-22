'use client'

import { useRef, useState, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { CopyIcon, CheckIcon } from '@/components/icons'
import { InfoTooltip } from '@/components/info-tooltip'

// rehype-pretty-code wraps each code block in <figure data-rehype-pretty-code-figure>.
// This maps that figure to add a copy button on top.
export function CodeBlock({
  children,
  className,
  ...props
}: ComponentProps<'figure'>) {
  const figureRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  // Only code-block figures get the button; pass anything else through.
  if (!('data-rehype-pretty-code-figure' in props)) {
    return (
      <figure className={className} {...props}>
        {children}
      </figure>
    )
  }

  async function handleCopy() {
    const code = figureRef.current?.querySelector('pre')?.textContent
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (e.g. insecure context); nothing useful to do.
    }
  }

  return (
    <figure ref={figureRef} className={cn('relative', className)} {...props}>
      <InfoTooltip label={copied ? 'Copied!' : 'Copy'} side='left'>
        <button
          type='button'
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className='absolute right-2 top-2 z-10 rounded-md border border-border bg-muted/60 p-1.5 text-muted-foreground backdrop-blur transition hover:bg-muted hover:text-foreground'
        >
          {copied ? (
            <CheckIcon className='size-4 text-green-500' />
          ) : (
            <CopyIcon className='size-4' />
          )}
        </button>
      </InfoTooltip>
      {children}
    </figure>
  )
}

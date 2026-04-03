'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Loader, SunIcon, MoonIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time hydration guard
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button size='icon' variant='ghost'>
        <Loader className='size-5 animate-spin text-zinc-400' />
        <span className='sr-only'>Loading...</span>
      </Button>
    )
  }

  const ToggleThemeIcon =
    resolvedTheme === 'light' ? (
      <MoonIcon className='size-5 text-zinc-900' />
    ) : (
      <SunIcon className='size-5 text-foreground' />
    )

  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
    >
      {ToggleThemeIcon}
      <span className='sr-only'>Toggle Theme</span>
    </Button>
  )
}

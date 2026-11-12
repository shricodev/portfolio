'use client'

import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

// Both icons are always rendered and CSS picks one, so the server and client
// markup match and there's no loading state to flash.
export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      size='icon'
      variant='ghost'
      aria-label='Toggle theme'
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className='hidden size-[18px] dark:block' />
      <MoonIcon className='size-[18px] dark:hidden' />
    </Button>
  )
}

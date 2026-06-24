'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { HamburgerMenuIcon } from '@/components/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { cn, isActiveNavPath } from '@/lib/utils'

export function NavDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathName = usePathname()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        onClick={() => setIsOpen(prev => !prev)}
        className='flex-shrink-0'
      >
        <HamburgerMenuIcon
          aria-label='Menu Icon'
          className='size-6 font-bold'
        />
      </PopoverTrigger>

      <PopoverContent
        className='w-48 p-2'
        align='end'
        onBlur={() => setIsOpen(false)}
      >
        <div className='flex flex-col space-y-1'>
          {NAV_LINKS.map(link => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block rounded px-4 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800',
                isActiveNavPath(pathName, link.path)
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

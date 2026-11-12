'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { HamburgerMenuIcon } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { cn, isActiveNavPath } from '@/lib/utils'

export function NavDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        aria-label='Open navigation menu'
        className={buttonVariants({ variant: 'ghost', size: 'icon' })}
      >
        <HamburgerMenuIcon aria-hidden='true' className='size-5' />
      </PopoverTrigger>

      <PopoverContent className='w-44 p-1.5' align='end'>
        <ul className='flex flex-col'>
          {NAV_LINKS.map(link => {
            const active = isActiveNavPath(pathname, link.path)
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'hover:bg-accent block rounded-md px-3 py-2 text-sm',
                    active
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground',
                  )}
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

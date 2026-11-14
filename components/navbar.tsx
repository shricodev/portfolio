'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { NavDropdown } from '@/components/nav-dropdown'
import { NAV_LINKS } from '@/lib/constants'
import { cn, isActiveNavPath } from '@/lib/utils'

export const Navbar = () => {
  const pathname = usePathname()

  return (
    <header className='border-border/60 bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 -mx-4 border-b px-4 sm:-mx-6 sm:px-6 backdrop-blur-md'>
      <nav
        aria-label='Main'
        className='flex h-16 items-center justify-between gap-4'
      >
        <Link
          href='/'
          aria-label='Shrijal Acharya, home'
          className='text-foreground font-mono text-2xl font-bold tracking-tight select-none'
        >
          shrijal<span className='text-muted-foreground'>.</span>
        </Link>

        <div className='flex items-center gap-1'>
          <ul className='hidden items-center gap-1 sm:flex'>
            {NAV_LINKS.map(link => {
              const active = isActiveNavPath(pathname, link.path)
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-2.5 py-1.5 text-[15px] transition-colors',
                      active
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          <ThemeToggle />
          <div className='sm:hidden'>
            <NavDropdown />
          </div>
        </div>
      </nav>
    </header>
  )
}

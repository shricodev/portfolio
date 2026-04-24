'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { usePathname } from 'next/navigation'
import { NavDropdown } from '@/components/nav-dropdown'
import { NAV_LINKS } from '@/lib/constants'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['700'],
})

export const Navbar = () => {
  const pathName = usePathname()

  const getClassnameForLink = (path: string) =>
    pathName === path
      ? 'underline underline-offset-4 text-foreground capitalize'
      : 'text-muted-foreground capitalize hover:text-zinc-600 dark:hover:text-zinc-500'

  const homeLink =
    NAV_LINKS.find(link => link.name.toLowerCase() === 'home')?.path ?? '/'

  return (
    <header className='fixed inset-x-0 top-0 z-50 backdrop-blur-sm'>
      <div className='mx-auto max-w-3xl px-4 py-6'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center sm:hidden'>
              <NavDropdown />
            </div>

            <Link
              href={homeLink}
              className={`${poppins.className} select-none flex-nowrap text-2xl font-bold uppercase`}
            >
              shrijal.
            </Link>
          </div>

          <div className='ml-0 hidden items-center justify-between gap-6 font-semibold text-muted-foreground sm:ml-auto sm:flex'>
            <ul className='flex items-center gap-6'>
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={getClassnameForLink(link.path)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ThemeToggle />
          </div>

          <div className='ml-auto sm:hidden'>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}

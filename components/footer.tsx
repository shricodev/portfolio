import Link from 'next/link'
import { SOCIAL_LINKS } from '@/lib/constants'

const year = new Date().getFullYear()

export const Footer = () => {
  return (
    <footer className='border-border/60 text-muted-foreground mt-24 flex flex-col gap-4 border-t py-8 text-sm sm:flex-row sm:items-center sm:justify-between'>
      <p>&copy; {year} Shrijal Acharya</p>
      <ul className='flex flex-wrap gap-x-5 gap-y-2'>
        {SOCIAL_LINKS.filter(link => link.footer).map(link => (
          <li key={link.name}>
            <a
              href={link.href}
              target='_blank'
              rel='noreferrer noopener'
              className='hover:text-foreground transition-colors'
            >
              {link.name}
            </a>
          </li>
        ))}
        <li>
          <a href='/rss.xml' className='hover:text-foreground transition-colors'>
            RSS
          </a>
        </li>
        <li>
          <Link
            href='/privacy'
            className='hover:text-foreground transition-colors'
          >
            Privacy
          </Link>
        </li>
      </ul>
    </footer>
  )
}

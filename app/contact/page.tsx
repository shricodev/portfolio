import Link from 'next/link'
import { Contact } from '@/components/contact'
import { BASE_URL, PUBLIC_GMAIL } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Shrijal Acharya about full-time roles, freelance work, or collaborations.',
  alternates: {
    canonical: new URL('/contact', BASE_URL).toString(),
  },
}

export default function Page() {
  const linkClass = 'text-foreground underline underline-offset-4'

  return (
    <section>
      <h1 className='title'>Get in touch</h1>
      <p className='lede'>
        I am open to full-time roles, freelance work, and collaborations. Use
        the form, email{' '}
        <a href={`mailto:${PUBLIC_GMAIL}`} className={linkClass}>
          {PUBLIC_GMAIL}
        </a>
        , or{' '}
        <Link href='/meet' className={linkClass}>
          book a 30 minute call
        </Link>
        .
      </p>

      <Contact />
    </section>
  )
}

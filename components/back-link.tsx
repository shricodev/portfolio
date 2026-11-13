import Link from 'next/link'
import { ArrowLeftIcon } from '@/components/icons'

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors'
    >
      <ArrowLeftIcon className='size-4' />
      {label}
    </Link>
  )
}

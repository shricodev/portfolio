import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className='py-16'>
      <p className='eyebrow'>404</p>
      <h1 className='title mt-2'>This page does not exist</h1>
      <p className='lede'>
        The link may be old, or the post or project may have been removed.
      </p>
      <div className='mt-6 flex flex-wrap gap-3'>
        <Link href='/' className={buttonVariants()}>
          Go home
        </Link>
        <Link href='/projects' className={buttonVariants({ variant: 'outline' })}>
          Browse projects
        </Link>
      </div>
    </section>
  )
}

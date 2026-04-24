import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center text-center'>
      <h1 className='text-9xl font-bold text-muted-foreground'>404</h1>
      <p className='mt-4 text-xl text-muted-foreground'>
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href='/'
        className={buttonVariants({
          size: 'lg',
          variant: 'outline',
          className: 'mt-4 text-muted-foreground',
        })}
      >
        Go Back Home
      </Link>
    </div>
  )
}

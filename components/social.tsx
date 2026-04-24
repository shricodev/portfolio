import { cn } from '@/lib/utils'
import { SVGProps } from 'react'

export const Social = ({
  href,
  name,
  Icon,
  iconClassName,
}: {
  href: string
  name: string
  Icon: React.ComponentType<SVGProps<SVGSVGElement>>
  iconClassName?: string
}) => {
  return (
    <a
      target='_blank'
      rel='noreferrer noopener'
      href={href}
      aria-label={`${name} Profile`}
    >
      <div className='flex items-center justify-between rounded bg-zinc-50 px-6 py-4 transition hover:bg-neutral-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-900'>
        <Icon className={cn('size-5 md:size-6', iconClassName)} />
      </div>
    </a>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowUpRightIcon } from '@/components/icons'
import {
  BLOG_VIEWS_LABEL,
  CAREER_START_YEAR,
  GITHUB_URL,
} from '@/lib/constants'
import { roundedDownLabel } from '@/lib/utils'

export function Hero({ postCount }: { postCount: number }) {
  const years = new Date().getFullYear() - CAREER_START_YEAR

  const stats = [
    { value: `${years}+`, label: 'years building software' },
    {
      // falls back to the last known number if the feeds are down
      value: postCount > 0 ? roundedDownLabel(postCount) : '60+',
      label: 'blog posts published',
    },
    { value: BLOG_VIEWS_LABEL, label: 'blog views, all time' },
    { value: '10+', label: 'events run for 500+ developers' },
  ]

  return (
    <section>
      <div className='flex items-center gap-4'>
        <Image
          src='/images/shrijal-acharya.webp'
          alt='Portrait of Shrijal Acharya'
          width={56}
          height={56}
          sizes='56px'
          preload
          className='border-border bg-muted size-14 rounded-full border object-cover'
        />
        <div>
          <h1 className='text-lg leading-tight font-semibold tracking-tight'>
            Shrijal Acharya
          </h1>
          <p className='text-muted-foreground mt-0.5 text-sm'>
            Developer Advocate at Composio and software engineer
          </p>
        </div>
      </div>

      <p className='mt-8 text-[1.7rem] leading-[1.2] font-semibold tracking-tight text-balance sm:text-4xl sm:leading-[1.15]'>
        I build AI agents and developer tools, then write the guides that help
        other engineers ship them.
      </p>

      <div className='text-muted-foreground mt-6 max-w-2xl space-y-4 leading-7'>
        <p>
          I work mostly in{' '}
          <span className='text-foreground'>TypeScript, Python, and Go</span>,
          and deploy with{' '}
          <span className='text-foreground'>Docker and Kubernetes</span> on GCP
          and AWS. Every project I build comes with a write-up, so other
          developers can follow along and build on it.
        </p>
        <p>
          I also write for freeCodeCamp and DEV, run community workshops as a
          Microsoft Gold Student Ambassador, and spent three years leading a
          development team at Oppia Foundation. And yes, I use Vim and Arch,
          btw.
        </p>
      </div>

      <div className='mt-8 flex flex-wrap gap-3'>
        <Link href='/projects' className={buttonVariants()}>
          See projects
        </Link>
        <Link href='/blogs' className={buttonVariants({ variant: 'outline' })}>
          Read the blog
        </Link>
        <Link href='/meet' className={buttonVariants({ variant: 'outline' })}>
          Book a call
        </Link>
        <a
          href={GITHUB_URL}
          target='_blank'
          rel='noreferrer noopener'
          className={buttonVariants({ variant: 'ghost', className: 'gap-1' })}
        >
          GitHub
          <ArrowUpRightIcon className='size-4' />
        </a>
      </div>

      <dl className='border-border bg-border mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4'>
        {stats.map(stat => (
          <div key={stat.label} className='bg-background flex flex-col p-4'>
            <dt className='text-muted-foreground order-2 mt-1 text-xs leading-5'>
              {stat.label}
            </dt>
            <dd className='order-1 font-mono text-2xl font-semibold tracking-tight'>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

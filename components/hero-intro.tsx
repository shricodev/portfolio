import Image from 'next/image'
import { AlertIcon, BookIcon, ChartIcon, UsersGroup } from '@/components/icons'
import { CustomHoverCard } from '@/components/custom-hover-card'
import { EXPERIENCE_YEARS } from '@/lib/constants'

export const HeroIntro = () => {
  return (
    <section>
      <div className='flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-10'>
        <div className='flex-1'>
          <h1 className='title mb-2 no-underline'>
            Hey, I&#39;m <span className='text-primary'>Shrijal</span>{' '}
            <span role='img' aria-label='waving hand'>
              👋
            </span>
          </h1>
          <p className='subtitle mb-6 text-xl font-semibold text-muted-foreground'>
            Web Dev, Cloud, and DevOps Engineer
          </p>

          <div className='my-2 text-pretty font-medium leading-7 text-zinc-800 dark:text-zinc-300'>
            I&apos;m a full-stack developer and DevOps engineer currently
            working as a freelancer. I also contribute to
            <CustomHoverCard
              triggerText='freeCodeCamp'
              title='freeCodeCamp'
              description='An organization that offers free online resources to help people learn to code.'
              dateText='Joined April 2024'
              avatarSrc='/images/freeCodeCamp.svg'
              avatarFallback='FCC'
            />
            and as a Lead Collaborator at
            <CustomHoverCard
              triggerText='Oppia Foundation'
              title='Oppia Foundation'
              description='An organization empowering learners across the globe by providing them with equitable access to high-quality basic education.'
              dateText='Joined May 2023'
              avatarSrc='/images/oppia.svg'
              avatarFallback='O'
            />
            As an
            <CustomHoverCard
              triggerText='MLSA'
              title='Microsoft Learn Student Ambassador'
              description='Global group of campus leaders who are eager to help fellow students, lead in their tech community.'
              dateText='Joined April 2024'
              avatarSrc='/images/microsoft.svg'
              avatarFallback='MS'
            />
            , I organize a number of online events to grow with the community.
          </div>
        </div>

        {/* Desktop Profile Image */}
        <div className='hidden md:block'>
          <Image
            className='rounded-full'
            src='/images/shrijal-acharya.webp'
            alt='Profile photo of Shrijal Acharya'
            width={175}
            height={175}
            priority
            sizes='175px'
          />
        </div>
      </div>

      <p className='mt-3 max-w-full text-pretty font-medium leading-7 text-zinc-800 dark:text-zinc-300'>
        I have <strong>{EXPERIENCE_YEARS}+</strong> years of experience, and I
        primarily work with <strong>TypeScript</strong>, <strong>Python</strong>
        , <strong>Golang</strong>, <strong>Docker</strong>, and{' '}
        <strong>Kubernetes</strong>. I also do work with cloud platforms, mainly{' '}
        <strong>GCP</strong> and <strong>AWS</strong>.
      </p>

      <div className='my-6 rounded-lg border-none bg-zinc-50 p-4 shadow-sm dark:bg-zinc-900 md:flex md:items-center'>
        <div className='flex items-center'>
          <div className='flex flex-shrink-0 items-center justify-center'>
            <div className='hidden sm:block md:hidden'>
              <Image
                src='/images/shrijal-acharya.webp'
                alt='Profile photo of Shrijal Acharya'
                width={128}
                height={128}
                className='rounded-full'
                loading='eager'
                sizes='128px'
              />
            </div>

            {/* Stats Icon Container */}
            <div
              className='hidden h-32 w-32 flex-shrink-0 rounded-xl bg-zinc-100 p-5 dark:bg-zinc-800 md:block'
              aria-hidden='true'
            >
              <ChartIcon className='text-muted-foreground' />
            </div>
          </div>

          <div className='ml-4'>
            <ul className='mt-2 space-y-2 font-normal text-muted-foreground'>
              <li className='flex items-center gap-1'>
                <UsersGroup
                  className='size-5 flex-shrink-0'
                  aria-hidden='true'
                />
                <span>Organized 10+ online events with 500+ developers</span>
              </li>
              <li className='flex items-center gap-1'>
                <BookIcon className='size-5 flex-shrink-0' aria-hidden='true' />
                <span>60+ blog posts all time</span>
              </li>
              <li className='flex items-center gap-1'>
                <AlertIcon
                  className='size-5 flex-shrink-0'
                  aria-hidden='true'
                />
                <span>550,000+ blog views all time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className='mt-3 max-w-full text-pretty font-medium leading-7 text-zinc-800 dark:text-zinc-300'>
        I enjoy building side projects in my free time that help me automate a
        lot of my stuffs. I love writing about my projects, cloud, web, and
        DevOps.{' '}
        <span className='mr-1 opacity-70 dark:opacity-70'>
          (Oh, and yes, I use Vim and Arch, btw)
        </span>
        <span role='img' aria-label='wink'>
          😉
        </span>
      </p>
    </section>
  )
}

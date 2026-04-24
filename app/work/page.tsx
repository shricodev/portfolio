import { CustomHoverCard } from '@/components/custom-hover-card'
import { NewsletterForm } from '@/components/newsletter-form'
import { Separator } from '@/components/ui/separator'
import { BASE_URL } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description:
    "Take a look at my professional journey, projects I've worked on, and my involvement with the community.",
  alternates: {
    canonical: new URL('/work', BASE_URL).toString(),
  },
}

export default function Page() {
  return (
    <>
      <section className='relative flex flex-col justify-center'>
        <h1 className='title'>Work</h1>

        <div className='prose max-w-full'>
          <p className='text-pretty font-medium text-zinc-800 dark:text-zinc-300'>
            I&apos;ve worked across software development, developer advocacy,
            open-source leadership, and technical writing with startups,
            foundations, and global programs. Here&apos;s a summary of my work
            so far.
          </p>
        </div>

        <Separator className='my-6' />

        <div className='space-y-14'>
          {/* Composio */}
          <article>
            <h2 className='mb-2 text-lg font-semibold text-zinc-900 dark:text-foreground'>
              Composio
            </h2>
            <div className='mb-4 flex items-center gap-2 text-sm'>
              <span className='text-zinc-600 dark:text-zinc-300'>
                Developer Advocate
              </span>
              <span className='text-muted-foreground'>·</span>
              <time className='text-muted-foreground'>Feb 2025 - Present</time>
            </div>
            <div className='text-pretty font-medium leading-relaxed text-zinc-800 dark:text-zinc-300'>
              <span>At</span>
              <CustomHoverCard
                triggerText='Composio'
                title='Composio'
                description='A platform that enables AI agents to interact with 250+ external tools and services.'
                dateText='Joined February 2025'
                avatarSrc=''
                avatarFallback='CO'
              />
              <span>
                I build hands-on AI agent projects and create developer-focused
                content that helps others learn and ship with AI tooling.
              </span>
              <ul className='mt-4 list-disc space-y-1 pl-5 text-pretty font-medium text-zinc-900 dark:text-zinc-200'>
                <li>
                  Build end-to-end AI agent projects and working demos.
                </li>
                <li>
                  Write tutorials, integration guides, and technical
                  walkthroughs.
                </li>
                <li>
                  All content published on the Composio authors page.
                </li>
              </ul>
            </div>
          </article>

          {/* Studio1 */}
          <article>
            <h2 className='mb-2 text-lg font-semibold text-zinc-900 dark:text-foreground'>
              Studio1
            </h2>
            <div className='mb-4 flex items-center gap-2 text-sm'>
              <span className='text-zinc-600 dark:text-zinc-300'>
                Software Developer · Freelance
              </span>
              <span className='text-muted-foreground'>·</span>
              <time className='text-muted-foreground'>Oct 2024 - Present</time>
            </div>
            <div className='text-pretty font-medium leading-relaxed text-zinc-800 dark:text-zinc-300'>
              <span>At</span>
              <CustomHoverCard
                triggerText='Studio1'
                title='Studio1'
                description='A technical content and developer advocacy agency helping startups and devtool companies scale.'
                dateText='Joined October 2024'
                avatarSrc=''
                avatarFallback='S1'
              />
              <span>
                I build full-stack and AI-powered applications, and write
                detailed implementation guides for each project I ship.
              </span>
              <ul className='mt-4 list-disc space-y-1 pl-5 text-pretty font-medium text-zinc-900 dark:text-zinc-200'>
                <li>
                  Built an AI chatbot that lets users chat with a Notion
                  database.
                </li>
                <li>
                  Built a real-time Kanban board with localization and
                  AI-generated item descriptions.
                </li>
                <li>
                  Write step-by-step blog posts and setup guides for each
                  project.
                </li>
              </ul>
            </div>
          </article>

          {/* freeCodeCamp */}
          <article>
            <h2 className='mb-2 text-lg font-semibold text-zinc-900 dark:text-foreground'>
              freeCodeCamp
            </h2>
            <div className='mb-4 flex items-center gap-2 text-sm'>
              <span className='text-zinc-600 dark:text-zinc-300'>
                Technical Writer
              </span>
              <span className='text-muted-foreground'>·</span>
              <time className='text-muted-foreground'>Apr 2024 - Present</time>
            </div>
            <div className='text-pretty font-medium leading-relaxed text-zinc-800 dark:text-zinc-300'>
              <span>At</span>
              <CustomHoverCard
                triggerText='freeCodeCamp'
                title='freeCodeCamp'
                description='A nonprofit community that helps millions of people learn to code for free.'
                dateText='Joined April 2024'
                avatarSrc='/images/freeCodeCamp.svg'
                avatarFallback='fCC'
              />
              <span>
                I write in-depth technical articles and tutorials for one of the
                largest developer communities on the web.
              </span>
              <ul className='mt-4 list-disc space-y-1 pl-5 text-pretty font-medium text-zinc-900 dark:text-zinc-200'>
                <li>
                  Cover topics across full-stack development, AI, and DevOps.
                </li>
                <li>
                  Articles reach a global audience of millions of developers.
                </li>
              </ul>
            </div>
          </article>

          {/* Oppia Foundation */}
          <article>
            <h2 className='mb-2 text-lg font-semibold text-zinc-900 dark:text-foreground'>
              Oppia Foundation
            </h2>
            <div className='mb-4 flex items-center gap-2 text-sm'>
              <span className='text-zinc-600 dark:text-zinc-300'>
                Development Team Lead
              </span>
              <span className='text-muted-foreground'>·</span>
              <time className='text-muted-foreground'>May 2023 - Present</time>
            </div>
            <div className='text-pretty font-medium leading-relaxed text-zinc-800 dark:text-zinc-300'>
              <span>At</span>
              <CustomHoverCard
                triggerText='Oppia Foundation'
                title='Oppia Foundation'
                description='An open-source platform that provides quality education to those who lack access to it.'
                dateText='Joined May 2023'
                avatarSrc='/images/oppia.svg'
                avatarFallback='OP'
              />
              <span>
                I lead the Dev Workflow and Welfare team, focused on improving
                developer experience across the project.
              </span>
              <ul className='mt-4 list-disc space-y-1 pl-5 text-pretty font-medium text-zinc-900 dark:text-zinc-200'>
                <li>
                  Contribute code to the LaCE team, building and maintaining
                  onboarding for new contributors.
                </li>
                <li>
                  Collaborate with the Contributor Dashboard team on the
                  full-stack contribution management app.
                </li>
              </ul>
            </div>
          </article>

          {/* Microsoft */}
          <article>
            <h2 className='mb-2 text-lg font-semibold text-zinc-900 dark:text-foreground'>
              Microsoft
            </h2>
            <div className='mb-4 flex items-center gap-2 text-sm'>
              <span className='text-zinc-600 dark:text-zinc-300'>
                Gold Student Ambassador
              </span>
              <span className='text-muted-foreground'>·</span>
              <time className='text-muted-foreground'>Apr 2024 - Present</time>
            </div>
            <div className='text-pretty font-medium leading-relaxed text-zinc-800 dark:text-zinc-300'>
              <span>As a</span>
              <CustomHoverCard
                triggerText='Microsoft'
                title='Microsoft Learn Student Ambassador'
                description='Global group of campus leaders who are eager to help fellow students, lead in their tech community.'
                dateText='Joined April 2024'
                avatarSrc='/images/microsoft.svg'
                avatarFallback='MS'
              />
              <span>
                Learn Student Ambassador, I help students learn new technologies
                and build with the developer community.
              </span>
              <ul className='mt-4 list-disc space-y-1 pl-5 text-pretty font-medium text-zinc-900 dark:text-zinc-200'>
                <li>Run workshops and mentor students.</li>
                <li>Build projects and share Microsoft tools with the community.</li>
                <li>Promoted to Gold tier in August 2025.</li>
              </ul>
            </div>
          </article>

          {/* GirlScript Summer of Code */}
          <article>
            <h2 className='mb-2 text-lg font-semibold text-zinc-900 dark:text-foreground'>
              GirlScript Summer of Code
            </h2>
            <div className='mb-4 flex items-center gap-2 text-sm'>
              <span className='text-zinc-600 dark:text-zinc-300'>
                Individual Contributor
              </span>
              <span className='text-muted-foreground'>·</span>
              <time className='text-muted-foreground'>
                May 2024 - Jul 2024
              </time>
            </div>
            <p className='text-pretty font-medium leading-relaxed text-zinc-800 dark:text-zinc-300'>
              Contributed to open-source projects during this three-month
              program, working under mentor guidance on real-world codebases.
            </p>
          </article>
        </div>
      </section>
      <NewsletterForm />
    </>
  )
}

'use client'

import {
  GitHubIcon,
  TwitterIcon,
  DevToIcon,
  HashnodeIcon,
  LinkedInIcon,
  RSSIcon,
} from '@/components/icons'
import { BASE_URL } from '@/lib/constants'
import { InfoTooltip } from '@/components/info-tooltip'

const socials = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/iamshrijal',
    icon: LinkedInIcon,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/shricodev',
    icon: GitHubIcon,
  },
  {
    name: 'DEV.to',
    href: 'https://dev.to/shricodev',
    icon: DevToIcon,
  },
  {
    name: 'Hashnode',
    href: 'https://shricodev.hashnode.dev',
    icon: HashnodeIcon,
  },
  {
    name: 'X',
    href: 'https://x.com/shricodev',
    icon: TwitterIcon,
  },
  {
    name: 'RSS',
    href: BASE_URL + '/rss.xml',
    icon: RSSIcon,
  },
]

export const Footer = () => {
  return (
    <footer className='pb-10 pt-16'>
      <div className='md:flex md:items-center md:justify-between'>
        <div className='flex justify-center space-x-6 md:order-2'>
          {socials.map(social => (
            <InfoTooltip
              key={social.name}
              label={social.name}
              side='top'
              className='text-xs'
            >
              <a
                key={social.name}
                href={social.href}
                target='_blank'
                rel='noreferrer noopener'
                className='text-muted-foreground hover:text-foreground'
              >
                <span className='sr-only'>{social.name}</span>
                <social.icon className='size-5' />
              </a>
            </InfoTooltip>
          ))}
        </div>
        <div className='mt-8 md:order-1 md:mt-0'>
          <p className='text-center text-base leading-5 text-muted-foreground'>
            &copy; {new Date().getFullYear()} Shrijal Acharya. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

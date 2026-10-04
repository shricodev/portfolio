import {
  CodingNinjasIcon,
  CourseraIcon,
  DevToIcon,
  DiscordIcon,
  GeeksForGeeksIcon,
  GitHubIcon,
  GmailIcon,
  HashnodeIcon,
  InstagramIcon,
  LeetCodeIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/icons'
import { Social } from '@/components/social'
import { InfoTooltip } from '@/components/info-tooltip'
import { PUBLIC_GMAIL } from '@/lib/constants'

const socialCategories = [
  {
    name: 'Social Media',
    items: [
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
        name: 'Instagram',
        href: 'https://instagram.com/itspiyush.ach',
        icon: InstagramIcon,
      },
    ],
  },
  {
    name: 'Additional Platforms',
    items: [
      {
        name: 'Discord',
        href: 'https://discordapp.com/users/1082700727220183151',
        icon: DiscordIcon,
      },
      {
        name: 'Gmail',
        href: `mailto:${PUBLIC_GMAIL}`,
        icon: GmailIcon,
      },
      {
        name: 'Coursera',
        href: 'https://www.coursera.org/user/6f7698d69fb4ee325093383f88d8d2ff',
        icon: CourseraIcon,
      },
    ],
  },
  {
    name: 'Coding Profiles',
    items: [
      {
        name: 'LeetCode',
        href: 'https://leetcode.com/shricodev',
        icon: LeetCodeIcon,
      },
      {
        name: 'GeeksForGeeks',
        href: 'https://auth.geeksforgeeks.org/user/octopie23',
        icon: GeeksForGeeksIcon,
      },
      {
        name: 'CodingNinjas',
        href: 'https://www.codingninjas.com/codestudio/profile/6d2f4a1b-5461-4e51-92fa-90f00f70f309',
        icon: CodingNinjasIcon,
      },
    ],
  },
]

export const Socials = () => {
  return (
    <section className='my-8 w-full space-y-5'>
      {socialCategories.map(category => (
        <div key={category.name} className='space-y-2'>
          <h3 className='text-lg font-semibold capitalize text-muted-foreground'>
            {category.name}
          </h3>

          <div className='flex flex-row space-x-2 overflow-x-auto'>
            {category.items.map(social => (
              <InfoTooltip
                key={social.name}
                label={social.name}
                side='bottom'
                className='text-xs'
              >
                <Social
                  key={social.name}
                  href={social.href}
                  name={social.name}
                  Icon={social.icon}
                  iconClassName='size-5 md:size-6'
                />
              </InfoTooltip>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

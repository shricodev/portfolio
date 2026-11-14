// NOTE: Make sure there is no trailing space in the end
export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://www.techwithshrijal.com'

export const SITE_DESCRIPTION =
  'Shrijal Acharya is a developer advocate and software engineer building AI agent projects, developer tools, and technical content.'

export const CAREER_START_YEAR = 2021

export const PUBLIC_GMAIL = 'contact@techwithshrijal.com'
export const OTHER_EMAIL = 'shrijal.acharya@gmail.com'

export const GITHUB_USERNAME = 'shricodev'
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`
export const CAL_LINK = 'shrijal-acharya/30min'

export const SEARCH_QUERY_PARAM = 'q'
export const SOURCE_QUERY_PARAM = 'source'
export const SORT_QUERY_PARAM = 'sort'
export const LANGUAGE_QUERY_PARAM = 'lang'

export const BLOG_SOURCE_OPTIONS = ['all', 'devto', 'freecodecamp'] as const
export type BlogSourceFilter = (typeof BLOG_SOURCE_OPTIONS)[number]

export const LIST_BATCH_SIZE = 12
export const DEFAULT_THEME = 'dark'

// Blog stats that can't be computed from the feeds, update by hand.
export const BLOG_VIEWS_LABEL = '1.1M+'

export const DEVTO_USERNAME = 'shricodev'
export const DEVTO_API_BASE = 'https://dev.to/api'
export const DEVTO_BLOGS_PER_PAGE = 30

// freeCodeCamp author RSS feed. Hashnode's GraphQL API went Pro-only :(((
// so now, need to deal with the content from the RSS feed.
export const FREECODECAMP_RSS_URL =
  'https://www.freecodecamp.org/news/author/shricodev/rss/'

export const BLOG_SOURCE_PREFIX_SEPARATOR = '--'

export const PROJECT_FILTER_TOPIC = 'showcase'

// Hand-picked, in display order. Repo names must match GitHub exactly.
// Anything not here still shows up under "Recent" and in the full list.
export const FEATURED_PROJECTS = [
  'gophercast',
  'chashma-screen-grounding-engine',
  'kron-k8s-agent',
  'durable-agent-in-the-loop',
  'chat-nextjs-mcp-client',
  'dotfiles',
]

// Personal favorites: the more technical how-to posts, in display order.
// Each entry is the slug from the /blogs/<slug> URL on this site.
export const FEATURED_POSTS = [
  'hashnode--how-to-build-a-durable-autoscaling-ai-agent-with-temporal-composio-keda-and-kubernetes',
  'devto--how-to-build-and-deploy-an-mcp-server-to-production-2026-07-28-spec-50p3',
  'hashnode--build-your-own-ai-app-builder-with-next-js-aws-and-sandboxes',
  'devto--build-your-own-chat-mcp-client-with-nextjs-4a0k',
  'devto--my-speaker-broke-so-i-built-a-lan-speaker-19nc',
  'hashnode--build-a-langgraph-composio-powered-discord-bot',
  'devto--build-your-personal-siri-with-llama-3-like-a-pro-5h1o',
  'hashnode--host-llms-locally-in-docker-on-azure',
  'devto--build-your-own-personal-voice-ai-agent-to-control-all-your-apps-2dfa',
  'devto--how-i-manage-my-system-and-dotfiles-with-ansible-8m1',
  'devto--automate-your-instagram-posts-like-a-pro-with-cron-jobs-3idb',
  'devto--build-your-own-cli-version-of-monkeytype-bm7',
]

export const ROUTES = [
  '',
  '/blogs',
  '/projects',
  '/work',
  '/events',
  '/contact',
  '/privacy',
  '/meet',
]

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Work', path: '/work' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
]

export const SOCIAL_LINKS = [
  { name: 'GitHub', href: GITHUB_URL, footer: true },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/iamshrijal', footer: true },
  { name: 'X', href: 'https://x.com/shricodev', footer: true },
  { name: 'DEV', href: 'https://dev.to/shricodev', footer: true },
  {
    name: 'freeCodeCamp',
    href: 'https://www.freecodecamp.org/news/author/shricodev/',
    footer: false,
  },
  { name: 'Hashnode', href: 'https://shricodev.hashnode.dev', footer: false },
  {
    name: 'Instagram',
    href: 'https://instagram.com/justpiyush.ach',
    footer: false,
  },
  { name: 'LeetCode', href: 'https://leetcode.com/shricodev', footer: false },
  {
    name: 'Coursera',
    href: 'https://www.coursera.org/user/6f7698d69fb4ee325093383f88d8d2ff',
    footer: false,
  },
  {
    name: 'Discord',
    href: 'https://discord.com/users/1082700727220183151',
    footer: false,
  },
]

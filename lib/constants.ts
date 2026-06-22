// NOTE: Make sure there is no trailing space in the end
export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://www.techwithshrijal.com'

export const EXPERIENCE_YEARS = 5

export const PUBLIC_GMAIL = 'contact@techwithshrijal.com'
export const OTHER_EMAIL = 'shrijal.acharya@gmail.com'

export const TOOLTIP_DELAY_DURATION = 150

export const SEARCH_QUERY_PARAM = 'q'
export const SOURCE_QUERY_PARAM = 'source'

export const BLOG_SOURCE_OPTIONS = ['all', 'devto', 'freecodecamp'] as const
export type BlogSourceFilter = (typeof BLOG_SOURCE_OPTIONS)[number]

export const PROJECTS_BATCH_SIZE = 6
export const BLOGS_BATCH_SIZE = 6
export const RECENT_BLOGS_DEFAULT = 4
export const RECENT_PROJECTS_DEFAULT = 5
export const PAGE_INDEX_DEFAULT = 1
export const WORDS_PER_MINUTE_DEFAULT = 250
export const STARS_COUNT_TO_SHOW_ICON = 7
export const DEFAULT_THEME = 'dark'

export const DEBOUNCE_TIME_DEFAULT = 250
export const DEBOUNCE_TIME_PROJECTS = 250
export const DEBOUNCE_TIME_BLOGS = 300

export const HASHNODE_USERNAME = 'shricodev'

export const DEVTO_USERNAME = 'shricodev'
export const DEVTO_API_BASE = 'https://dev.to/api'
export const DEVTO_BLOGS_PER_PAGE = 30

export const HASHNODE_FCC_HOST = 'freecodecamp.org/news'

// freeCodeCamp author RSS feed. Hashnode's GraphQL API went Pro-only :(((
// so now, need to deal with the content from the RSS feed.
export const FREECODECAMP_RSS_URL =
  'https://www.freecodecamp.org/news/author/shricodev/rss/'

export const BLOG_SOURCE_PREFIX_SEPARATOR = '--'

export const PROJECT_FILTER_TOPIC = 'showcase'

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
  { name: 'Blogs', path: '/blogs' },
  { name: 'Projects', path: '/projects' },
  { name: 'Work', path: '/work' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
]

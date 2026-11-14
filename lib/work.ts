export type WorkLink = { label: string; href: string }

export type WorkEntry = {
  org: string
  orgUrl?: string
  role: string
  type?: string
  start: string
  end: string
  summary: string
  highlights: string[]
  // internal or external pointers to the actual output
  links?: WorkLink[]
}

export const WORK: WorkEntry[] = [
  {
    org: 'Composio',
    orgUrl: 'https://composio.dev',
    role: 'Developer Advocate',
    type: 'Part-time',
    start: 'Feb 2025',
    end: 'Present',
    summary:
      'I build hands-on AI agent projects on top of Composio, a platform that connects agents to external tools and services, and write the content that helps other developers ship with it.',
    highlights: [
      'Build end-to-end AI agent projects and working demos.',
      'Write tutorials, integration guides, and technical walkthroughs.',
    ],
    links: [
      {
        label: 'Composio author page',
        href: 'https://composio.dev/authors/shrijal',
      },
      { label: 'kron-k8s-agent', href: '/projects/kron-k8s-agent' },
      {
        label: 'durable-agent-in-the-loop',
        href: '/projects/durable-agent-in-the-loop',
      },
      {
        label: 'chat-nextjs-mcp-client',
        href: '/projects/chat-nextjs-mcp-client',
      },
    ],
  },
  {
    org: 'Studio1',
    orgUrl: 'https://www.studio1hq.com/',
    role: 'Software Developer',
    type: 'Freelance',
    start: 'Oct 2024',
    end: 'Present',
    summary:
      'Studio1 is a technical content and developer advocacy agency for startups and devtool companies. I build full-stack and AI-powered applications there and write a detailed implementation guide for each one.',
    highlights: [
      'Built an AI chatbot that lets users chat with a Notion database.',
      'Built a real-time Kanban board with localization and AI-generated item descriptions.',
      'Write step-by-step blog posts and setup guides for each project.',
    ],
    links: [
      {
        label: 'copilotkit-with-notion-api',
        href: '/projects/copilotkit-with-notion-api',
      },
      {
        label: 'kanban-ai-realtime-localization',
        href: '/projects/kanban-ai-realtime-localization',
      },
    ],
  },
  {
    org: 'freeCodeCamp',
    orgUrl: 'https://www.freecodecamp.org/news/author/shricodev/',
    role: 'Technical Writer',
    type: 'Part-time',
    start: 'Apr 2024',
    end: 'Present',
    summary:
      'I write in-depth technical articles and tutorials for one of the largest developer communities on the web.',
    highlights: [
      'Cover topics across full-stack development, AI, and DevOps.',
      'Articles reach a global audience of millions of developers.',
    ],
    links: [
      { label: 'freeCodeCamp articles', href: '/blogs?source=freecodecamp' },
    ],
  },
  {
    org: 'DEV (Forem)',
    orgUrl: 'https://dev.to/shricodev',
    role: 'Technical Writer',
    type: 'Self-employed',
    start: 'Jul 2023',
    end: 'Present',
    summary:
      'I publish technical articles on DEV about the tools I use and the projects I build.',
    highlights: [
      'Articles on DEV have passed 550,000 views.',
      'Grew a following of 6,500+ readers.',
      'Featured multiple times among the authors of the week.',
    ],
    links: [{ label: 'Articles on DEV', href: '/blogs?source=devto' }],
  },
  {
    org: 'Microsoft',
    orgUrl: 'https://mvp.microsoft.com/studentambassadors',
    role: 'Gold Student Ambassador',
    type: 'Community',
    start: 'Apr 2024',
    end: 'Jul 2026',
    summary:
      'As a Microsoft Student Ambassador, I helped students learn new technologies, ran workshops, and built projects with the developer community.',
    highlights: [
      'Ran workshops and mentored students who wanted to grow their skills.',
      'Shared Microsoft tools and built projects together with the community.',
      'Joined in April 2024 and was promoted to the Gold tier in August 2025.',
    ],
    links: [{ label: 'Events I have run', href: '/events' }],
  },
  {
    org: 'Oppia Foundation',
    orgUrl: 'https://www.oppia.org',
    role: 'Development Team Lead',
    type: 'Open source',
    start: 'May 2023',
    end: 'Apr 2026',
    summary:
      'Oppia is an open-source platform that brings quality education to people who lack access to it. I led the Dev Workflow and Welfare team, which works on developer experience across the project.',
    highlights: [
      'Contributed code to the LaCE team, which builds and maintains the onboarding flow for new contributors.',
      'Worked with the Contributor Dashboard team on the full-stack app for managing contributions.',
    ],
    links: [{ label: 'oppia/oppia', href: 'https://github.com/oppia/oppia' }],
  },
  {
    org: 'GirlScript Summer of Code',
    role: 'Individual Contributor',
    type: 'Part-time',
    start: 'May 2024',
    end: 'Jul 2024',
    summary:
      'Contributed to open-source projects during this three-month program, working under mentor guidance on real-world codebases.',
    highlights: [],
  },
]

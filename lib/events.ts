export type EventPlatform = 'linkedin'

export type EventImage = {
  src: string
  alt: string
  width: number
  height: number
}

export type EventItem = {
  id: string
  title: string
  description: string
  date: string
  platform: EventPlatform
  postUrl: string
  image: EventImage
}

const RAW_EVENTS: EventItem[] = [
  {
    id: 'gold-ambassador-milestone',
    title: 'Gold Ambassador Milestone',
    description:
      'Celebrated being promoted to the Gold tier of the Microsoft Learn Student Ambassadors program.',
    date: '2025-08-10',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/feed/update/urn:li:share:7361788697710632960',
    image: {
      src: '/images/gold-ambassador-shrijal-1.jpg',
      alt: 'Shrijal Acharya celebrating promotion to Microsoft Learn Student Ambassador Gold tier.',
      width: 1159,
      height: 904,
    },
  },
  {
    id: 'open-source-ansible-session',
    title: 'Open Source & Ansible Session',
    description:
      'Delivered a session on open source contributions and Ansible fundamentals for the MLSA community.',
    date: '2025-06-20',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/posts/iamshrijal_msftstudentambassadors-ansible-learninpublic-activity-7342031016770883584-ch5x',
    image: {
      src: '/images/azure-vm-and-ansible-2.jpg',
      alt: 'Session slide covering Azure VM provisioning with Ansible.',
      width: 800,
      height: 381,
    },
  },
  {
    id: 'github-actions-cicd-demo',
    title: 'GitHub Actions and CI/CD Workflow Demo',
    description:
      'Walked through GitHub Actions and real-world CI/CD workflow setups for the student developer community.',
    date: '2025-02-05',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/posts/iamshrijal_github-msftstudentambassadors-learninpublic-activity-7291787443735822337-i4gV',
    image: {
      src: '/images/ci-cd-gh-actions-3.jpg',
      alt: 'Slide from the GitHub Actions and CI/CD workflow walkthrough.',
      width: 1919,
      height: 1012,
    },
  },
  {
    id: 'mlsa-community-event-nepal',
    title: 'MLSA Community Event in Nepal',
    description:
      'Shared highlights from an in-person Microsoft Student Ambassadors community event held in Nepal.',
    date: '2024-12-11',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/feed/update/urn:li:share:7271756926605017088',
    image: {
      src: '/images/nepal-event-4.jpg',
      alt: 'Group photo from the Microsoft Student Ambassadors community event in Nepal.',
      width: 1526,
      height: 592,
    },
  },
  {
    id: 'dev-containers-web-api-workshop',
    title: 'Dev Containers & Web API Workshop',
    description:
      'Ran a workshop on using Dev Containers for reproducible development environments alongside Web API fundamentals.',
    date: '2024-10-22',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/posts/iamshrijal_devcontainers-msftstudentambassadors-webapi-activity-7253604599989735424-rAPk',
    image: {
      src: '/images/dev-containers-5.jpg',
      alt: 'Presentation slide from the Dev Containers and Web API workshop.',
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 'global-mlsa-africa-event',
    title: 'Live Global MLSA Event with African Students',
    description:
      'Joined a live global Microsoft Student Ambassadors event alongside students from Africa, connecting and sharing across communities.',
    date: '2024-07-12',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/posts/iamshrijal_microsoft-learn-student-ambassadors-nest-activity-7216654687549177857-g-S5',
    image: {
      src: '/images/global-mlsa-6.jpg',
      alt: 'Live global Microsoft Student Ambassadors session with students from Africa.',
      width: 1535,
      height: 1536,
    },
  },
  {
    id: 'intro-dev-containers',
    title: 'Intro to Dev Containers',
    description:
      'Presented an introduction to Dev Containers and how they streamline and standardise development environments.',
    date: '2024-06-25',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/posts/iamshrijal_msftstudentambassadors-learninpublic-activity-7210227193304539136-W3Ek',
    image: {
      src: '/images/containers-7.jpg',
      alt: 'Intro to Dev Containers session slide.',
      width: 800,
      height: 440,
    },
  },
  {
    id: 'intro-git-github',
    title: 'Intro to Git and GitHub',
    description:
      'Delivered an introductory session on Git and GitHub for students getting started with version control.',
    date: '2024-05-23',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/posts/iamshrijal_msftstudentambassadors-microsoft-learninpublic-activity-7198544290032050177-dO0D',
    image: {
      src: '/images/git-github-8.jpg',
      alt: 'Intro to Git and GitHub session slide.',
      width: 1161,
      height: 653,
    },
  },
  {
    id: 'azure-workshop-msa',
    title: 'Azure Workshop for Student Ambassadors',
    description:
      'Delivered an introductory Azure workshop for the Microsoft Student Ambassadors network.',
    date: '2024-05-18',
    platform: 'linkedin',
    postUrl:
      'https://www.linkedin.com/posts/iamshrijal_msftstudentambassadors-microsoft-azure-activity-7196511691830923264-IOr6',
    image: {
      src: '/images/azure-openai-9.jpg',
      alt: 'Azure workshop session slide for Microsoft Student Ambassadors.',
      width: 1131,
      height: 583,
    },
  },
]

export const EVENTS: EventItem[] = [...RAW_EVENTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)

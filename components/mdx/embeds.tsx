import { EmbeddedTweet } from 'react-tweet'
import { getTweet } from 'react-tweet/api'
import { ArrowUpRightIcon } from '@/components/icons'

function extractYouTubeId(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  )
  return match ? match[1] : trimmed
}

export function YouTubeEmbed({ id }: { id: string }) {
  const videoId = extractYouTubeId(id)
  return (
    <div className='not-prose my-6 aspect-video w-full overflow-hidden rounded-md border border-border'>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title='YouTube video'
        loading='lazy'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        className='h-full w-full border-0'
      />
    </div>
  )
}

export async function TweetEmbed({ id }: { id: string }) {
  const tweetId = id.replace(/[^\d]/g, '')
  if (!tweetId) return <FallbackLink kind='tweet' target={id} />

  let tweet: Awaited<ReturnType<typeof getTweet>> | null = null
  try {
    tweet = (await getTweet(tweetId)) ?? null
  } catch {
    // Deleted, private, or upstream 4xx; fall through to a link
  }

  if (!tweet) {
    return (
      <FallbackLink
        kind='tweet'
        target={`https://x.com/i/status/${tweetId}`}
      />
    )
  }

  return (
    <div className='not-prose my-6 flex justify-center'>
      <EmbeddedTweet tweet={tweet} />
    </div>
  )
}

const KIND_LABELS: Record<string, string> = {
  github: 'GitHub repository',
  gist: 'GitHub gist',
  link: 'Linked post',
  embed: 'Embedded link',
  post: 'DEV post',
  acorn: 'External resource',
  codepen: 'CodePen',
  codesandbox: 'CodeSandbox',
  stackblitz: 'StackBlitz',
  replit: 'Replit',
  spotify: 'Spotify',
  vimeo: 'Vimeo',
  tweet: 'Tweet',
}

function normalizeHref(target: string, kind: string): string {
  const trimmed = target.trim()
  if (/^https?:\/\//.test(trimmed)) return trimmed
  if (kind === 'github') return `https://github.com/${trimmed}`
  if (kind === 'gist') return `https://gist.github.com/${trimmed}`
  if (kind === 'post') return `https://dev.to/${trimmed}`
  return trimmed
}

export function FallbackLink({
  kind,
  target,
}: {
  kind: string
  target: string
}) {
  const label = KIND_LABELS[kind] ?? kind.charAt(0).toUpperCase() + kind.slice(1)
  const href = normalizeHref(target, kind)
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer noopener'
      className='not-prose my-6 flex items-center gap-3 rounded-md border border-border bg-muted/30 px-4 py-3 text-sm no-underline transition hover:bg-muted/60'
    >
      <ArrowUpRightIcon className='size-4 shrink-0 text-muted-foreground' />
      <span className='flex min-w-0 flex-col'>
        <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          {label}
        </span>
        <span className='truncate text-foreground'>{target}</span>
      </span>
    </a>
  )
}

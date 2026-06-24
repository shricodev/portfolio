// Shown instantly on navigation to /blogs while the (dynamic) page fetches
// posts from DEV + freeCodeCamp. Without this, the router blocks on the
// server render and the previous page hangs for a second or two.
function CardSkeleton() {
  return (
    <div className='w-full animate-pulse rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900'>
      <div className='mb-3 h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800' />
      <div className='mb-2 h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800' />
      <div className='mb-4 flex gap-2'>
        <div className='h-5 w-14 rounded bg-zinc-200 dark:bg-zinc-800' />
        <div className='h-5 w-14 rounded bg-zinc-200 dark:bg-zinc-800' />
      </div>
      <div className='space-y-2'>
        <div className='h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800' />
        <div className='h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800' />
      </div>
      <div className='mt-4 h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-800' />
    </div>
  )
}

export default function Loading() {
  return (
    <section>
      <h1 className='title'>Blogs</h1>

      {/* alert + search + count placeholders so the layout doesn't jump */}
      <div className='mb-4 h-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900' />
      <div className='mb-4 h-9 w-full animate-pulse rounded-md bg-zinc-100 sm:w-1/2 dark:bg-zinc-900' />
      <div className='mb-4 h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800' />

      <div className='flex flex-col gap-8'>
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}

// Without this, navigating from /blogs to a post would fall back to the
// parent app/blogs/loading.tsx
export default function Loading() {
  return (
    <section className='pb-10'>
      <div className='mb-8 h-9 w-32 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900' />

      <div className='mb-6 aspect-[1000/420] w-full animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900' />

      <div className='mb-3 h-4 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800' />

      <div className='mb-2 h-8 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800' />

      <div className='mt-3 flex items-center gap-2'>
        <div className='size-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800' />
        <div className='h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800' />
      </div>

      <div className='mt-4 flex gap-2'>
        <div className='h-5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800' />
        <div className='h-5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800' />
        <div className='h-5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800' />
      </div>

      <div className='mt-12 space-y-3'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800'
            style={{ width: `${[100, 95, 90, 70, 100, 85, 92, 60][i]}%` }}
          />
        ))}
      </div>
    </section>
  )
}

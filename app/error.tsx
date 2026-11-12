'use client'

import { Button } from '@/components/ui/button'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className='py-16'>
      <h1 className='title'>Something broke</h1>
      <p className='lede'>
        That page failed to load. It&apos;s probably a hiccup with one of the
        services this site pulls from.
      </p>
      <Button className='mt-6' onClick={reset}>
        Try again
      </Button>
    </section>
  )
}

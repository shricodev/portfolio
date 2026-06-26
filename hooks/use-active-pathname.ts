'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Because we ship a Proxy file (proxy.ts), Next treats every statically
// prerendered route as potentially rewritten, so usePathname() returns an
// unresolved value during the first render. That's why the active nav link
// didn't highlight on first landing but did after navigating back.
// Reading it only after mount sidesteps it: server + first client render
// agree on null, then the effect re-reads the now-resolved pathname.
export function useActivePathname(): string | null {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? pathname : null
}

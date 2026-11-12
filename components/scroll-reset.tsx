'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'

// Next only scrolls to top when the new page's first element is off screen.
// With a short header that's often not the case, so a slightly scrolled list
// page would hand its offset to the next page. Reset it ourselves, but leave
// back/forward (browser restores those) and #hash links alone.
export function ScrollReset() {
  const pathname = usePathname()
  const isFirstRender = useRef(true)
  const poppedPath = useRef<string | null>(null)

  useEffect(() => {
    const onPopState = () => {
      poppedPath.current = window.location.pathname
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const cameFromHistory = poppedPath.current === pathname
    poppedPath.current = null
    if (cameFromHistory || window.location.hash) return
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

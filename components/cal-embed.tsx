'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { CAL_LINK } from '@/lib/constants'

const NAMESPACE = 'intro-call'

export default function CalEmbed() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'light' ? 'light' : 'dark'

  // keep the booking UI in step with the site theme
  useEffect(() => {
    let cancelled = false
    getCalApi({ namespace: NAMESPACE })
      .then(cal => {
        if (cancelled) return
        cal('ui', { theme, hideEventTypeDetails: false, layout: 'month_view' })
      })
      .catch(() => {
        // script blocked or offline, the direct link under the embed still works
      })
    return () => {
      cancelled = true
    }
  }, [theme])

  return (
    <Cal
      namespace={NAMESPACE}
      calLink={CAL_LINK}
      config={{ layout: 'month_view', theme }}
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
    />
  )
}

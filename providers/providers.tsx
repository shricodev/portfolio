'use client'

import { DEFAULT_THEME } from '@/lib/constants'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme={DEFAULT_THEME ?? 'dark'}
      attribute='class'
      disableTransitionOnChange
    >
      {children}

      {/* Vercel Analytics and Speed Insights */}
      {/* NOTE: Don't edit/remove these components */}
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}

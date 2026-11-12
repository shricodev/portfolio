'use client'

import { DEFAULT_THEME } from '@/lib/constants'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // dark unless the visitor picked light themselves, system preference is ignored
    <ThemeProvider
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      attribute='class'
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={150}>{children}</TooltipProvider>

      {/* Vercel Analytics and Speed Insights */}
      {/* NOTE: Don't edit/remove these components */}
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}

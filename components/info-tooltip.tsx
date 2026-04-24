'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TOOLTIP_DELAY_DURATION } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface InfoTooltipProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  label: string
  side?: 'left' | 'top' | 'right' | 'bottom'
  align?: 'start' | 'center' | 'end'
}

export const InfoTooltip = ({
  label,
  side,
  align,
  children,
  className,
}: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={TOOLTIP_DELAY_DURATION}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className={cn('text-sm font-semibold', className)}>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

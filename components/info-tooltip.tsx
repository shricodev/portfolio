'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface InfoTooltipProps {
  children: React.ReactNode
  label: string
  side?: 'left' | 'top' | 'right' | 'bottom'
}

// TooltipProvider lives once in providers.tsx
export const InfoTooltip = ({ label, side, children }: InfoTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p className='text-xs font-medium'>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  label: string
  tabs: { name: string; content: ReactNode }[]
}

// Every panel is server-rendered up front, switching just toggles visibility.
export function Tabs({ label, tabs }: TabsProps) {
  const [active, setActive] = useState(0)
  const id = useId()

  return (
    <div>
      <div
        role='tablist'
        aria-label={label}
        className='border-border flex gap-6 border-b'
        onKeyDown={event => {
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
          const step = event.key === 'ArrowRight' ? 1 : -1
          const next = (active + step + tabs.length) % tabs.length
          setActive(next)
          document.getElementById(`${id}-tab-${next}`)?.focus()
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            id={`${id}-tab-${index}`}
            type='button'
            role='tab'
            aria-selected={index === active}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={cn(
              '-mb-px border-b-2 pb-3 text-sm font-medium transition-colors',
              index === active
                ? 'border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.name}
          id={`${id}-panel-${index}`}
          role='tabpanel'
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== active}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}

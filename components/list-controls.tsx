'use client'

import { cn } from '@/lib/utils'

export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}) {
  return (
    <input
      type='search'
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={label}
      autoComplete='off'
      spellCheck={false}
      className='border-input placeholder:text-muted-foreground h-10 w-full rounded-md border bg-transparent px-3 text-sm sm:max-w-xs'
    />
  )
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div
      role='group'
      aria-label={label}
      className='border-border inline-flex flex-wrap gap-0.5 rounded-md border p-0.5'
    >
      {options.map(option => (
        <button
          key={option.value}
          type='button'
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors',
            option.value === value
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// Keeps filters in the URL without a navigation, so nothing re-renders on the
// server and a shared link still opens with the same filters.
export function syncUrlParams(params: Record<string, string | undefined>) {
  const url = new URL(window.location.href)
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
    else url.searchParams.delete(key)
  }
  window.history.replaceState(null, '', url)
}

export function EmptyState({
  title,
  onReset,
}: {
  title: string
  onReset: () => void
}) {
  return (
    <div className='border-border rounded-md border border-dashed px-6 py-12 text-center'>
      <p className='text-sm font-medium'>{title}</p>
      <button
        type='button'
        onClick={onReset}
        className='text-muted-foreground hover:text-foreground mt-2 text-sm underline underline-offset-4'
      >
        Clear filters
      </button>
    </div>
  )
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function isActiveNavPath(
  pathname: string | null,
  linkPath: string,
): boolean {
  if (!pathname) return false
  if (linkPath === '/') return pathname === '/'
  return pathname === linkPath || pathname.startsWith(`${linkPath}/`)
}

// Fixed to UTC so the server and the browser always print the same day.
export function formatDate(date: string, style: 'long' | 'short' = 'long') {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

// 64 -> "60+", 71 -> "70+"
export function roundedDownLabel(count: number, step = 10): string {
  if (count < step) return String(count)
  return `${Math.floor(count / step) * step}+`
}

export function formatCount(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count)
}

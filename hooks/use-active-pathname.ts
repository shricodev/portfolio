'use client'

import { usePathname } from 'next/navigation'

export function useActivePathname(): string {
  return usePathname()
}

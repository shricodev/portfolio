'use client'

import { Component, type ReactNode } from 'react'

interface EmbedBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface EmbedBoundaryState {
  hasError: boolean
}

// If an embed blows up while rendering (e.g. a deleted tweet), show the
// fallback instead of crashing the whole page.
export class EmbedBoundary extends Component<
  EmbedBoundaryProps,
  EmbedBoundaryState
> {
  state: EmbedBoundaryState = { hasError: false }

  static getDerivedStateFromError(): EmbedBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

/**
 * In-process concurrency limiter. Caps the number of concurrently-running
 * tasks; additional callers queue and resume FIFO. Per-Node-process only.
 * Next build workers each get their own limiter, so pick concurrency
 * accordingly.
 */
export function createLimiter(maxConcurrent: number) {
  let active = 0
  const waiters: (() => void)[] = []

  const release = () => {
    active--
    const next = waiters.shift()
    if (next) next()
  }

  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (active >= maxConcurrent) {
      await new Promise<void>(resolve => waiters.push(resolve))
    }
    active++
    try {
      return await task()
    } finally {
      release()
    }
  }
}

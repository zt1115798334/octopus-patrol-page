import { useRef, useCallback } from 'react'

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const last = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const remaining = delay - (now - last.current)

      if (remaining <= 0) {
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = undefined
        }
        last.current = now
        fn(...args)
      } else if (!timer.current) {
        timer.current = setTimeout(() => {
          last.current = Date.now()
          timer.current = undefined
          fn(...args)
        }, remaining)
      }
    },
    [fn, delay],
  )
}

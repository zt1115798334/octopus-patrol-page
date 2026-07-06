import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Custom hook for managing dialog open/close state
 */
export function useDialogState(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const onToggle = useCallback(() => setOpen((prev) => !prev), [])
  return { open, onOpen, onClose, onToggle, setOpen }
}

/**
 * Custom hook for clipboard operations
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch {
      return false
    }
  }, [])
  return { copy, copied }
}

/**
 * Custom hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  const prev = ref.current
  ref.current = value
  return prev
}

/**
 * Custom hook for table selection
 */
export function useTableSelection<T>(items: T[], getId: (item: T) => number | string) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())

  const toggle = useCallback((item: T) => {
    const id = getId(item)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [getId])

  const toggleAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map(getId)))
    }
  }, [items, selectedIds, getId])

  const clear = useCallback(() => setSelectedIds(new Set()), [])

  const isSelected = useCallback(
    (item: T) => selectedIds.has(getId(item)),
    [selectedIds, getId],
  )

  const isAllSelected = items.length > 0 && selectedIds.size === items.length

  return {
    selectedIds,
    selectedArray: [...selectedIds],
    toggle,
    toggleAll,
    clear,
    isSelected,
    isAllSelected,
    selectedCount: selectedIds.size,
  }
}

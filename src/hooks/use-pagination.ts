import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  defaultPageSize?: number
  defaultPage?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  total: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setTotal: (total: number) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { defaultPageSize = 10, defaultPage = 1 } = options

  const [page, setPage] = useState(defaultPage)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [total, setTotal] = useState(0)

  const handleSetPage = useCallback((p: number) => {
    setPage(Math.max(1, p))
  }, [])

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const nextPage = useCallback(() => {
    setPage((p) => {
      const totalPages = Math.ceil(total / pageSize)
      return Math.min(p + 1, totalPages || 1)
    })
  }, [total, pageSize])

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1))
  }, [])

  const reset = useCallback(() => {
    setPage(defaultPage)
    setPageSize(defaultPageSize)
    setTotal(0)
  }, [defaultPage, defaultPageSize])

  return {
    page,
    pageSize,
    total,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setTotal,
    nextPage,
    prevPage,
    reset,
  }
}

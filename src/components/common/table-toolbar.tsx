import { type ReactNode } from 'react'
import { Search, X, RefreshCw, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TableToolbarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  onRefresh?: () => void
  isRefreshing?: boolean
  onExport?: () => void
  children?: ReactNode
  className?: string
  selectedCount?: number
  onClearSelection?: () => void
  batchActions?: ReactNode
}

export function TableToolbar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  onRefresh,
  isRefreshing = false,
  onExport,
  children,
  className,
  selectedCount = 0,
  onClearSelection,
  batchActions,
}: TableToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Batch actions bar */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center justify-between rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 px-4 py-2.5"
        >
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            {batchActions}
            {onClearSelection && (
              <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8 text-xs">
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Main toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          {onSearchChange && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 h-9"
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-neutral-400" />
                </button>
              )}
            </div>
          )}
          {children}
        </div>

        <div className="flex items-center gap-1.5">
          {onExport && (
            <Button variant="ghost" size="sm" onClick={onExport} className="h-8 gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 w-8"
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

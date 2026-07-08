import { forwardRef, useCallback, type ComponentProps, type ButtonHTMLAttributes } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './button'
import type { VariantProps } from 'class-variance-authority'

function Pagination({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full items-center justify-between gap-4', className)}
      {...props}
    />
  )
}
Pagination.displayName = 'Pagination'

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex items-center gap-1', className)} {...props} />
  ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('list-none', className)} {...props} />
  ),
)
PaginationItem.displayName = 'PaginationItem'

interface PaginationLinkProps
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled'>,
    VariantProps<typeof buttonVariants> {
  isActive?: boolean
  className?: string
  children?: React.ReactNode
}

function PaginationLink({
  isActive,
  size = 'icon',
  className,
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      variant={isActive ? 'default' : 'ghost'}
      size={size === 'icon' ? 'icon' : size}
      className={cn('h-8 w-8 text-sm', isActive && 'pointer-events-none', className)}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </Button>
  )
}
PaginationLink.displayName = 'PaginationLink'

function PaginationPrevious({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <PaginationLink aria-label="Go to previous page" size="icon" className={cn('gap-1', className)} {...props}>
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

function PaginationNext({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <PaginationLink aria-label="Go to next page" size="icon" className={cn('gap-1', className)} {...props}>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

function PaginationFirst({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <PaginationLink aria-label="Go to first page" size="icon" className={className} {...props}>
      <ChevronsLeft className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationFirst.displayName = 'PaginationFirst'

function PaginationLast({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <PaginationLink aria-label="Go to last page" size="icon" className={className} {...props}>
      <ChevronsRight className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationLast.displayName = 'PaginationLast'

function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span aria-hidden className={cn('flex h-8 w-8 items-center justify-center', className)} {...props}>
      <MoreHorizontal className="h-4 w-4 text-neutral-400" />
    </span>
  )
}
PaginationEllipsis.displayName = 'PaginationEllipsis'

function PaginationSummary({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap', className)} {...props} />
  )
}
PaginationSummary.displayName = 'PaginationSummary'

// Page size selector
interface PageSizeSelectorProps {
  value: number
  options?: number[]
  onChange: (value: number) => void
  className?: string
}

function PageSizeSelector({
  value,
  options = [10, 20, 50, 100],
  onChange,
  className,
}: PageSizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400', className)}>
      <span>Rows per page</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80 bg-transparent dark:text-neutral-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-400 transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
PageSizeSelector.displayName = 'PageSizeSelector'

// Generate page numbers with ellipsis
function getPageNumbers(currentPage: number, totalPages: number, siblingCount = 1): (number | 'ellipsis')[] {
  const totalNumbers = siblingCount * 2 + 5
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const showLeftDots = leftSiblingIndex > 2
  const showRightDots = rightSiblingIndex < totalPages - 1

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1)
    return [...leftRange, 'ellipsis', totalPages]
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + 2 * siblingCount
    const rightRange = Array.from({ length: rightCount }, (_, i) => totalPages - rightCount + i + 1)
    return [1, 'ellipsis', ...rightRange]
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  )
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
}

// Full pagination component
interface PaginationBarProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize: number
  siblingCount?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  showSummary?: boolean
  showPageSizeSelector?: boolean
  className?: string
}

function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  siblingCount = 1,
  onPageChange,
  onPageSizeChange,
  showSummary = true,
  showPageSizeSelector = true,
  className,
}: PaginationBarProps) {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount)

  const safeOnPageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page)
      }
    },
    [currentPage, totalPages, onPageChange],
  )

  if (totalPages <= 0) return null

  return (
    <Pagination className={className}>
      <div className="flex items-center gap-4">
        {showPageSizeSelector && onPageSizeChange && (
          <PageSizeSelector value={pageSize} onChange={onPageSizeChange} />
        )}
        {showSummary && totalItems !== undefined && (
          <PaginationSummary>
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems.toLocaleString()}
          </PaginationSummary>
        )}
      </div>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst onClick={() => safeOnPageChange(1)} disabled={currentPage <= 1} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious onClick={() => safeOnPageChange(currentPage - 1)} disabled={currentPage <= 1} />
        </PaginationItem>
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink isActive={page === currentPage} onClick={() => safeOnPageChange(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext onClick={() => safeOnPageChange(currentPage + 1)} disabled={currentPage >= totalPages} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast onClick={() => safeOnPageChange(totalPages)} disabled={currentPage >= totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
PaginationBar.displayName = 'PaginationBar'

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  PaginationSummary,
  PageSizeSelector,
  PaginationBar,
  getPageNumbers,
}

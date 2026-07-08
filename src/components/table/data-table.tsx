import {
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
  type Table as TanStackTable,
} from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { PaginationBar } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  // Server-side pagination
  manualPagination?: boolean
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  // Server-side sorting
  manualSorting?: boolean
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  // Row selection
  enableRowSelection?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  // Column visibility
  enableColumnVisibility?: boolean
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  // Misc
  getRowId?: (originalRow: TData, index: number) => string
  emptyMessage?: string
  emptyIcon?: ReactNode
  className?: string
  rowClassName?: string | ((row: TData) => string)
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  // Pagination
  manualPagination = false,
  pageCount: pageCountProp,
  pagination: paginationProp,
  onPaginationChange,
  // Sorting
  manualSorting = false,
  sorting: sortingProp,
  onSortingChange,
  // Row selection
  enableRowSelection = false,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  // Column visibility
  enableColumnVisibility = false,
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange,
  // Misc
  getRowId,
  emptyMessage = 'No data found',
  emptyIcon,
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(sortingProp ?? [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(columnVisibilityProp ?? {})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(rowSelectionProp ?? {})
  const [pagination, setPagination] = useState<PaginationState>(
    paginationProp ?? { pageIndex: 0, pageSize: 10 },
  )

  const currentSorting = manualSorting ? (sortingProp ?? sorting) : sorting
  const currentPagination = manualPagination ? (paginationProp ?? pagination) : pagination
  const currentRowSelection = rowSelectionProp ?? rowSelection
  const currentColumnVisibility = columnVisibilityProp ?? columnVisibility

  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    // Sorting
    ...(!manualSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
    }),
    manualSorting,
    // Filtering
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    // Pagination
    ...(!manualPagination && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
    }),
    manualPagination,
    pageCount: pageCountProp,
    // Row selection
    ...(enableRowSelection && {
      enableRowSelection: true,
      onRowSelectionChange: (updater) => {
        const newVal = typeof updater === 'function' ? updater(currentRowSelection) : updater
        setRowSelection(newVal)
        onRowSelectionChange?.(newVal)
      },
    }),
    // Column visibility
    ...(enableColumnVisibility && {
      onColumnVisibilityChange: (updater) => {
        const newVal = typeof updater === 'function' ? updater(currentColumnVisibility) : updater
        setColumnVisibility(newVal)
        onColumnVisibilityChange?.(newVal)
      },
    }),
    state: {
      sorting: currentSorting,
      columnFilters,
      columnVisibility: currentColumnVisibility,
      rowSelection: currentRowSelection,
      pagination: currentPagination,
    },
    // Sync external state
    ...(manualSorting && onSortingChange && {
      onSortingChange: (updater) => {
        const newVal = typeof updater === 'function' ? updater(currentSorting) : updater
        setSorting(newVal)
        onSortingChange(newVal)
      },
    }),
    ...(manualPagination && onPaginationChange && {
      onPaginationChange: (updater) => {
        const newVal = typeof updater === 'function' ? updater(currentPagination) : updater
        setPagination(newVal)
        onPaginationChange(newVal)
      },
    }),
  }) as TanStackTable<TData>

  const totalPages = manualPagination
    ? (pageCountProp ?? 1)
    : table.getPageCount()

  const handlePageChange = useCallback(
    (page: number) => {
      const newPagination = { pageIndex: page - 1, pageSize: currentPagination.pageSize }
      setPagination(newPagination)
      onPaginationChange?.(newPagination)
    },
    [currentPagination.pageSize, onPaginationChange],
  )

  const handlePageSizeChange = useCallback(
    (size: number) => {
      const newPagination = { pageIndex: 0, pageSize: size }
      setPagination(newPagination)
      onPaginationChange?.(newPagination)
    },
    [onPaginationChange],
  )

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-hidden', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {enableRowSelection && (
                <TableHead className="w-10">
                  <Skeleton className="h-4 w-4 rounded" />
                </TableHead>
              )}
              {columns.map((_col, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {enableRowSelection && (
                  <TableCell>
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                )}
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={cn('rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-hidden', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {enableRowSelection && <TableHead className="w-10"><Checkbox disabled /></TableHead>}
              {columns.map((col, i) => (
                <TableHead key={i}>
                  {typeof col.header === 'string' ? col.header : col.id}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <EmptyState
          icon={emptyIcon}
          title={emptyMessage}
          className="py-16 border-t-0 rounded-none"
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort()
                  const sortDir = header.column.getIsSorted()

                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      className={cn(
                        isSortable && 'cursor-pointer select-none',
                      )}
                      onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {isSortable && (
                          <span className="text-neutral-400">
                            {sortDir === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : sortDir === 'desc' ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, rowIdx) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: rowIdx * 0.02 }}
                className={cn(
                  'border-b border-neutral-100 dark:border-neutral-800 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                  row.getIsSelected() && 'bg-primary-50/50 dark:bg-primary-950/20',
                  onRowClick && 'cursor-pointer',
                  typeof rowClassName === 'function' ? rowClassName(row.original) : rowClassName,
                )}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPagination.pageIndex + 1}
          totalPages={totalPages}
          totalItems={data.length}
          pageSize={currentPagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSummary={false}
        />
      )}
    </div>
  )
}

export { flexRender }
export type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState, PaginationState }

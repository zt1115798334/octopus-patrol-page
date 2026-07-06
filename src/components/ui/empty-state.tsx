import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title = '暂无数据',
  description = '当前没有可显示的内容',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 px-4', className)}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 mb-4">
        {icon || <Inbox className="h-10 w-10 text-neutral-400 dark:text-neutral-500" />}
      </div>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

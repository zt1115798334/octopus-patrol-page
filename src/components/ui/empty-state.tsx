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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex flex-col items-center justify-center py-20 px-4', className)}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-primary-500/5 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50">
          {icon || <Inbox className="h-7 w-7 text-neutral-400 dark:text-neutral-500" />}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-6 text-center max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

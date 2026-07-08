import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-100/80 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
        success: 'bg-success-100/80 text-success-700 dark:bg-success-900/30 dark:text-success-300',
        warning: 'bg-warning-100/80 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
        danger: 'bg-danger-100/80 text-danger-700 dark:bg-cyan-900/30 dark:text-cyan-300',
        info: 'bg-accent-100/80 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300',
        outline: 'border border-neutral-200/80 text-neutral-600 dark:border-neutral-700/80 dark:text-neutral-300',
      },
      size: {
        sm: 'px-2 py-0 text-[10px]',
        default: 'px-2.5 py-0.5 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className={cn(
        'mr-1.5 h-1.5 w-1.5 rounded-full',
        variant === 'success' && 'bg-success-500',
        variant === 'warning' && 'bg-warning-500',
        variant === 'danger' && 'bg-danger-500 dark:bg-cyan-400',
        variant === 'info' && 'bg-accent-500',
        (!variant || variant === 'default') && 'bg-primary-500',
        variant === 'outline' && 'bg-neutral-400'
      )} />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }

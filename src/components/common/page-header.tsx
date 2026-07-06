import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children?: ReactNode
  actions?: ReactNode
  animate?: boolean
}

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, children, actions, animate = true, className, ...props }, ref) => {
    const Wrapper = animate ? motion.div : 'div'
    const motionProps = animate
      ? {
          initial: { opacity: 0, y: -8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
        }
      : {}

    return (
      <Wrapper
        ref={ref}
        className={cn(
          'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-6',
          className,
        )}
        {...motionProps}
        {...(props as Record<string, unknown>)}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-neutral-500">{description}</p>
          )}
          {children}
        </div>
        {actions && (
          <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>
        )}
      </Wrapper>
    )
  },
)
PageHeader.displayName = 'PageHeader'

export { PageHeader }
export type { PageHeaderProps }

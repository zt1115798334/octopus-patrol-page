import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, wrapperClassName, id, type, ...props }, ref) => {
    const inputId = id || React.useId()

    return (
      <div className={cn('space-y-1.5', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500',
              'dark:focus:ring-primary-500/20 dark:focus:border-primary-500',
              'transition-all duration-200',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20 dark:border-danger-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-danger-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }

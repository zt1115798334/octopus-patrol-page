import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.replace(/\s+/g, '-').toLowerCase()
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-[10px] border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-50',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-400 dark:focus:ring-primary-400/20 dark:focus:border-primary-400',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger-500 focus:ring-danger-500/15 focus:border-danger-500',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger-500">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
export { Textarea }

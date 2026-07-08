import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-[0_1px_3px_0_rgba(124,58,237,0.25)] hover:from-primary-700 hover:to-primary-600 hover:shadow-[0_4px_12px_-2px_rgba(124,58,237,0.35)] active:scale-[0.98]',
        secondary:
          'bg-neutral-100 text-neutral-700 border border-neutral-200/80 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700/80 dark:hover:bg-neutral-700/80',
        outline:
          'border border-neutral-200/80 bg-transparent text-neutral-700 hover:bg-neutral-100/80 dark:border-neutral-700/80 dark:text-neutral-300 dark:hover:bg-neutral-800/80',
        ghost:
          'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-50',
        danger:
          'bg-danger-500 text-white hover:bg-danger-600 shadow-[0_1px_3px_0_rgba(244,63,94,0.25)] hover:shadow-[0_4px_12px_-2px_rgba(244,63,94,0.35)]',
        link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        default: 'h-9 rounded-lg px-4 py-2',
        lg: 'h-11 rounded-lg px-6 text-base',
        icon: 'h-9 w-9 rounded-lg p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...(props as React.ComponentPropsWithoutRef<typeof Slot>)}
        >
          {loading ? <><Loader2 className="animate-spin" />{children}</> : children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading ? <><Loader2 className="animate-spin" />{children}</> : children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }

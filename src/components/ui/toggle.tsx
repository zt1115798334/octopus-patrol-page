import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150',
    'ring-offset-white dark:ring-offset-neutral-950',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-50',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-transparent data-[state=on]:bg-neutral-100 dark:data-[state=on]:bg-neutral-800 data-[state=on]:text-neutral-900 dark:data-[state=on]:text-neutral-50',
        outline:
          'border border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 data-[state=on]:bg-primary-50 dark:data-[state=on]:bg-primary-950/30 data-[state=on]:border-primary-200 dark:data-[state=on]:border-primary-800 data-[state=on]:text-primary-600 dark:data-[state=on]:text-primary-400',
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2.5 text-xs',
        lg: 'h-10 px-4',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Toggle = forwardRef<
  ElementRef<typeof TogglePrimitive.Root>,
  ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

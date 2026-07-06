import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 p-8 text-center max-w-md"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 dark:bg-danger-900/30">
          <AlertTriangle className="h-8 w-8 text-danger-500" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Something went wrong</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button onClick={resetErrorBoundary} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    </div>
  )
}

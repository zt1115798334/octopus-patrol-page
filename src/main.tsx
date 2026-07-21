import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { toast, Toaster } from 'sonner'
import { router } from './router'
import { ErrorFallback } from './components/common/error-fallback'
import { enableMockMode } from './lib/api-client'
import { handleMockRequest } from './mock'
import './styles/globals.css'
import './i18n'
import i18n from './i18n'

// Enable mock mode only when VITE_ENABLE_MOCK=true — defaults to real API calls
if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
  enableMockMode(handleMockRequest)
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      const msg = (error as { message?: string; __businessError?: boolean })?.message
      if (msg) {
        toast.error(msg)
      } else {
        toast.error(i18n.t('common.operationFailed'))
      }
    },
  }),
})

function AppLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 animate-pulse" />
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<AppLoading />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50',
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)

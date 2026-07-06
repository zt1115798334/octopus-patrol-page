import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { CommandPalette } from './command-palette'
import { BreadcrumbNav } from './breadcrumb-nav'
import { TabBar } from './tab-bar'
import { useSidebarStore, useSettingStore } from '@/stores'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'

function PageLoading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl mt-4" />
    </div>
  )
}

export function AppLayout() {
  const { collapsed } = useSidebarStore()
  const { showBreadcrumb, showTabs } = useSettingStore()

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Header />
        <Sidebar />
        <CommandPalette />

        <motion.main
          initial={false}
          animate={{ marginLeft: collapsed ? 72 : 240 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pt-14 min-h-screen"
        >
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="px-6 py-2">
              <BreadcrumbNav />
            </div>
          )}

          {/* Tab Bar */}
          {showTabs && <TabBar />}

          <div className="p-6">
            <Suspense fallback={<PageLoading />}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </Suspense>
          </div>
        </motion.main>
      </div>
    </TooltipProvider>
  )
}

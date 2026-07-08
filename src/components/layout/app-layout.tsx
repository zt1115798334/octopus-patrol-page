import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { CommandPalette } from './command-palette'
import { BreadcrumbNav } from './breadcrumb-nav'
import { TabBar } from './tab-bar'
import { useSidebarStore, useSettingStore } from '@/stores'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PageLoader } from '@/components/ui/page-loader'

export function AppLayout() {
  const { collapsed } = useSidebarStore()
  const { showBreadcrumb, showTabs, themeStyle } = useSettingStore()
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayPath, setDisplayPath] = useState(location.pathname)

  // Apply theme style attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme-style', themeStyle)
  }, [themeStyle])

  // Route transition: show loader on path change, then reveal content
  useEffect(() => {
    if (location.pathname !== displayPath) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayPath(location.pathname)
        setIsTransitioning(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, displayPath])

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Header />
        <Sidebar />
        <CommandPalette />

        <motion.main
          initial={false}
          animate={{ marginLeft: collapsed ? 72 : 260 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pt-14 min-h-screen border-l border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-950"
        >
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="px-6 py-2 border-b border-neutral-100 dark:border-neutral-800/60">
              <BreadcrumbNav />
            </div>
          )}

          {/* Tab Bar */}
          {showTabs && <TabBar />}

          <div className="p-6">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                {isTransitioning ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PageLoader />
                  </motion.div>
                ) : (
                  <motion.div
                    key={displayPath}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Outlet />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </div>
        </motion.main>
      </div>
    </TooltipProvider>
  )
}

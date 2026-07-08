import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useTabsStore, useSettingStore } from '@/stores'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const pathLabelMap: Record<string, string> = {
  '/': 'dashboard',
  '/user': 'user',
  '/role': 'role',
  '/menu': 'menu',
  '/permission': 'permission',
  '/tenant': 'tenant',
  '/log': 'log',
  '/ai-config': 'aiConfig',
  '/article': 'article',
  '/comment-keyword': 'commentKeyword',
  '/platform': 'platform',
  '/platform-account': 'platformAccount',
  '/platform-permission': 'platformPermission',
  '/job': 'job',
  '/pricing-plan': 'pricingPlan',
  '/pricing-history': 'pricingHistory',
  '/amqp': 'amqp',
  '/external': 'external',
  '/personal-center': 'personalCenter',
}

function getTabLabel(path: string, t: (key: string) => string): string {
  const navKey = pathLabelMap[path]
  return navKey ? t(`nav.${navKey}`) : path
}

export function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { tabs, activeTab, addTab, removeTab, setActiveTab, closeOtherTabs, closeAllTabs, closeRightTabs } = useTabsStore()
  const { showTabs } = useSettingStore()

  // Auto-add tab on navigation
  useEffect(() => {
    const path = location.pathname
    const label = getTabLabel(path, t)
    addTab({ id: path, path, label, closable: path !== '/' })
  }, [location.pathname, t, addTab])

  // Navigate when active tab changes
  useEffect(() => {
    if (activeTab && activeTab !== location.pathname) {
      navigate(activeTab)
    }
  }, [activeTab, navigate, location.pathname])

  if (!showTabs || tabs.length <= 1) return null

  const currentIndex = tabs.findIndex((t) => t.id === activeTab)

  return (
    <div className="flex items-center h-9 border-b border-neutral-200/80 dark:border-white/[0.04] bg-neutral-50/50 dark:bg-neutral-950/80 backdrop-blur-xl overflow-hidden">
      <div className="flex-1 flex items-center overflow-x-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="flex-shrink-0"
              >
                <button
                  onClick={() => {
                    setActiveTab(tab.id)
                    navigate(tab.id)
                  }}
                  className={cn(
                    'group flex items-center gap-1.5 h-9 px-3 text-xs font-medium transition-all relative border-r border-neutral-200/80 dark:border-white/[0.04]',
                    isActive
                      ? 'bg-white dark:bg-neutral-900/90 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.03]',
                  )}
                >
                  {tab.label}
                  {tab.closable && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTab(tab.id)
                      }}
                      className={cn(
                        'flex items-center justify-center h-3.5 w-3.5 rounded-full transition-all opacity-0 group-hover:opacity-100',
                        'hover:bg-neutral-200 dark:hover:bg-neutral-700',
                        isActive && 'opacity-70',
                      )}
                    >
                      <X className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Tab actions dropdown */}
      <div className="flex-shrink-0 px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => activeTab && closeOtherTabs(activeTab)}>
              {t('common.closeOther')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => activeTab && closeRightTabs(activeTab)}
              disabled={currentIndex >= tabs.length - 1}
            >
              {t('common.closeRight')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={closeAllTabs}>
              {t('common.closeAll')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

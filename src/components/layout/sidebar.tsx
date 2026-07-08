import { NavLink, useLocation } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Menu as MenuIcon,
  FileText,
  CreditCard,
  Globe,
  UserCheck,
  Play,
  Bot,
  History,
  Search,
  Star,
  Clock4,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores'
import { useTranslation } from 'react-i18next'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useState, useCallback } from 'react'



interface SidebarMenuGroup {
  label: string
  icon?: React.ReactNode
  items: SidebarMenuItem[]
}

interface SidebarMenuItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
  badge?: string | number
  permission?: string
}

export function Sidebar() {
  const { collapsed, favorites, recentMenus, toggleFavorite, addRecent } = useSidebarStore()
  const { t } = useTranslation()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['dashboard', 'system', 'platform', 'ai']))

  const menuGroups: SidebarMenuGroup[] = [
    {
      label: t('nav.dashboard'),
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [{ id: 'dashboard', label: t('nav.dashboard'), path: '/', icon: <LayoutDashboard className="h-4 w-4" /> }],
    },
    {
      label: t('nav.system'),
      items: [
        { id: 'user', label: t('nav.user'), path: '/user', icon: <Users className="h-4 w-4" /> },
        { id: 'pricing-plan', label: t('nav.pricingPlan'), path: '/pricing-plan', icon: <CreditCard className="h-4 w-4" /> },
        { id: 'menu', label: t('nav.menu'), path: '/menu', icon: <MenuIcon className="h-4 w-4" /> },
        { id: 'log', label: t('nav.log'), path: '/log', icon: <FileText className="h-4 w-4" /> },
      ],
    },
    {
      label: t('nav.platform'),
      items: [
        { id: 'platform', label: t('nav.platformList'), path: '/platform', icon: <Globe className="h-4 w-4" /> },
        { id: 'platform-account', label: t('nav.platformAccount'), path: '/platform-account', icon: <UserCheck className="h-4 w-4" /> },
        { id: 'run-plan', label: t('nav.runPlan'), path: '/run-plan', icon: <Play className="h-4 w-4" /> },
      ],
    },
    {
      label: t('nav.aiManagement'),
      items: [
        { id: 'ai-config', label: t('nav.aiConfig'), path: '/ai-config', icon: <Bot className="h-4 w-4" /> },
        { id: 'ai-usage', label: t('nav.aiUsage'), path: '/ai-usage', icon: <History className="h-4 w-4" /> },
      ],
    },
  ]

  const allItems = menuGroups.flatMap((g) => g.items)
  const filteredItems = search
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase()),
      )
    : null

  // Favorites
  const favoriteItems = allItems.filter((item) => favorites.has(item.id))

  // Recent
  const recentItems = recentMenus
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean) as SidebarMenuItem[]

  // Toggle group expand
  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const isItemActive = useCallback((item: SidebarMenuItem) => {
    if (item.path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(item.path)
  }, [location.pathname])

  const itemLinkClass = (item: SidebarMenuItem) =>
    cn(
      // Core layout: flex row, no wrap, vertical center
      'flex flex-row items-center gap-3 h-10 rounded-[10px] text-sm font-medium',
      'transition-all duration-200 group relative',
      'whitespace-nowrap',
      collapsed ? 'justify-center w-10 mx-auto' : 'px-4 w-full',
      isItemActive(item)
        ? 'bg-sidebar-active text-primary-700 dark:text-primary-400 shadow-sm'
        : 'text-neutral-600 dark:text-neutral-400 hover:bg-sidebar-hover hover:text-neutral-900 dark:hover:text-neutral-200',
    )

  const renderMenuItem = (item: SidebarMenuItem) => (
    <li key={item.id} className="list-none">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <NavLink
            to={item.path}
            end={item.path === '/'}
            onClick={() => addRecent(item.id)}
            className={itemLinkClass(item)}
          >
            <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5">
              {item.icon}
            </span>
            {!collapsed && (
              <>
                <span className="truncate min-w-0">{item.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(item.id)
                  }}
                  className={cn(
                    'flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded',
                    favorites.has(item.id)
                      ? 'text-warning-500'
                      : 'text-neutral-300 hover:text-warning-400',
                  )}
                >
                  <Star
                    className="h-4 w-4"
                    fill={favorites.has(item.id) ? 'currentColor' : 'none'}
                  />
                </button>
                {item.badge && (
                  <Badge variant="danger" size="sm" className="flex-shrink-0 text-[9px] h-4 px-1">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
      </Tooltip>
    </li>
  )

  return (
      <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-14 bottom-0 z-30 flex flex-col border-r border-sidebar-border bg-sidebar-bg overflow-hidden"
    >
      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              className="w-full h-8 pl-8 pr-3 rounded-[10px] border border-sidebar-border/80 bg-sidebar-hover text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-400 placeholder:text-neutral-500 transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-3">
        {search && filteredItems ? (
          <ul className="py-2 flex flex-col gap-y-0.5 m-0 p-0">
            {filteredItems.map(renderMenuItem)}
          </ul>
        ) : (
          <>
            {/* Favorites section */}
            {favoriteItems.length > 0 && (
              <div className="pt-3 pb-1">
                {!collapsed && (
                  <div className="flex items-center gap-2 px-4 py-1.5">
                    <Star className="h-4 w-4 text-warning-500" />
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {t('nav.favorites')}
                    </span>
                  </div>
                )}
                {collapsed && (
                  <div className="flex justify-center py-1">
                    <div className="h-px w-6 bg-amber-200 dark:bg-amber-800" />
                  </div>
                )}
                <ul className="flex flex-col gap-y-0.5 m-0 p-0">
                  {favoriteItems.map(renderMenuItem)}
                </ul>
                {!collapsed && <Separator className="my-2" />}
              </div>
            )}

            {/* Recent section */}
            {recentItems.length > 0 && !collapsed && (
              <div className="pt-1 pb-1">
                <div className="flex items-center gap-2 px-4 py-1.5">
                  <Clock4 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {t('nav.recent')}
                  </span>
                </div>
                <ul className="flex flex-col gap-y-0.5 m-0 p-0">
                  {recentItems.map(renderMenuItem)}
                </ul>
                <Separator className="my-2" />
              </div>
            )}

            {/* Menu groups */}
            {menuGroups.map((group, idx) => {
              const isFirst = idx === 0
              const isExpanded = expandedGroups.has(group.label)
              const hasChevron = group.items.length > 0 && !collapsed

              return (
                <div key={group.label} className={cn(isFirst ? 'pt-2' : 'pt-3')}>
                  {/* Group separator line - visible between groups */}
                  {!isFirst && !collapsed && (
                    <div className="mx-4 mb-2 border-t border-neutral-200 dark:border-neutral-800" />
                  )}
                  {!isFirst && collapsed && (
                    <div className="flex justify-center py-1">
                      <div className="h-px w-6 bg-sidebar-border" />
                    </div>
                  )}

                  {/* Group header - clickable if has items */}
                  {!collapsed && (
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-1.5 w-full text-left transition-colors',
                        hasChevron && 'cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300',
                      )}
                    >
                      {group.icon && (
                        <span className="flex-shrink-0 text-neutral-600 dark:text-neutral-400">{group.icon}</span>
                      )}
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex-1">
                        {group.label}
                      </span>
                      {hasChevron && (
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 flex-shrink-0',
                            isExpanded && 'rotate-180',
                          )}
                        />
                      )}
                    </button>
                  )}
                  {collapsed && group.items.length > 0 && (
                    <div className="flex justify-center py-1">
                      {/* Already handled by separator above */}
                    </div>
                  )}

                  {/* Group items */}
                  <AnimatePresence initial={false}>
                    {(collapsed || isExpanded) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="flex flex-col gap-y-0.5 m-0 p-0">
                          {group.items.map(renderMenuItem)}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            )}
          </>
        )}
      </ScrollArea>
    </motion.aside>
  )
}

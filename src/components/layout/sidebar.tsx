import { NavLink } from 'react-router-dom'

import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores'
import { usePermissionStore } from '@/stores'
import { useTranslation } from 'react-i18next'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

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
  const { hasPermission } = usePermissionStore()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const menuGroups: SidebarMenuGroup[] = [
    {
      label: t('nav.dashboard'),
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [{ id: 'dashboard', label: t('nav.dashboard'), path: '/', icon: <LayoutDashboard className="h-4 w-4" /> }],
    },
    {
      label: t('nav.system'),
      items: [
        { id: 'user', label: t('nav.user'), path: '/user', icon: <Users className="h-4 w-4" />, permission: 'user:list' },
        { id: 'pricing-plan', label: t('nav.pricingPlan'), path: '/pricing-plan', icon: <CreditCard className="h-4 w-4" />, permission: 'pricing-plan:list' },
        { id: 'menu', label: t('nav.menu'), path: '/menu', icon: <MenuIcon className="h-4 w-4" />, permission: 'menu:list' },
        { id: 'log', label: t('nav.log'), path: '/log', icon: <FileText className="h-4 w-4" />, permission: 'log:list' },
      ],
    },
    {
      label: t('nav.platform'),
      items: [
        { id: 'platform', label: t('nav.platformList'), path: '/platform', icon: <Globe className="h-4 w-4" />, permission: 'platform:list' },
        { id: 'platform-account', label: t('nav.platformAccount'), path: '/platform-account', icon: <UserCheck className="h-4 w-4" />, permission: 'platform-account:list' },
        { id: 'run-plan', label: t('nav.runPlan'), path: '/run-plan', icon: <Play className="h-4 w-4" />, permission: 'platform-scheme:list' },
      ],
    },
    {
      label: t('nav.aiManagement'),
      items: [
        { id: 'ai-config', label: t('nav.aiConfig'), path: '/ai-config', icon: <Bot className="h-4 w-4" />, permission: 'ai-config:list' },
        { id: 'ai-usage', label: t('nav.aiUsage'), path: '/ai-usage', icon: <History className="h-4 w-4" />, permission: 'ai-usage:list' },
      ],
    },
  ]

  // Filter by permission
  const permissionMenuGroups = menuGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || hasPermission(item.permission)),
  })).filter((group) => group.items.length > 0)

  const allItems = permissionMenuGroups.flatMap((g) => g.items)
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

  const renderMenuItem = (item: SidebarMenuItem) => (
    <Tooltip key={item.id} delayDuration={0}>
      <TooltipTrigger asChild>
        <NavLink
          to={item.path}
          end={item.path === '/'}
          onClick={() => addRecent(item.id)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 h-9 rounded-[10px] text-sm transition-all duration-200 group relative',
              collapsed ? 'justify-center px-0 w-9 mx-auto' : 'px-3',
              isActive
                ? 'bg-sidebar-active text-primary-700 dark:text-primary-400 font-medium shadow-sm dark:shadow-[0_0_12px_rgba(124,58,237,0.12)]'
                : 'text-neutral-500 hover:bg-sidebar-hover hover:text-neutral-800 dark:hover:text-neutral-300',
            )
          }
        >
          {item.icon}
          {!collapsed && (
            <>
              <span className="truncate flex-1">{item.label}</span>
              {/* Favorite toggle */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleFavorite(item.id)
                }}
                className={cn(
                  'opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded',
                  favorites.has(item.id)
                    ? 'text-warning-500'
                    : 'text-neutral-300 hover:text-warning-400',
                )}
              >
                <Star
                  className="h-3.5 w-3.5"
                  fill={favorites.has(item.id) ? 'currentColor' : 'none'}
                />
              </button>
              {item.badge && (
                <Badge variant="danger" size="sm" className="text-[9px] h-4 px-1">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </NavLink>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
    </Tooltip>
  )

  return (
      <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-14 bottom-0 z-30 flex flex-col border-r bg-sidebar-bg border-sidebar-border/80 overflow-hidden backdrop-blur-2xl backdrop-saturate-150 dark:shadow-[inset_0_0_80px_rgba(124,58,237,0.03)]"
    >
      {/* Search */}
      {!collapsed && (
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              className="w-full h-8 pl-8 pr-3 rounded-[10px] border border-sidebar-border/80 bg-sidebar-hover text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-400 placeholder:text-neutral-500 transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-2">
        {search && filteredItems ? (
          <div className="py-2 space-y-0.5">
            {filteredItems.map(renderMenuItem)}
          </div>
        ) : (
          <>
            {/* Favorites section */}
            {favoriteItems.length > 0 && (
              <div className="py-2">
                {!collapsed && (
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <Star className="h-3.5 w-3.5 text-warning-500" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      {t('nav.favorites')}
                    </span>
                  </div>
                )}
                {collapsed && (
                  <div className="flex justify-center py-1">
                    <div className="h-px w-6 bg-amber-200 dark:bg-amber-800" />
                  </div>
                )}
                <div className="space-y-0.5">
                  {favoriteItems.map(renderMenuItem)}
                </div>
                {!collapsed && <Separator className="my-2" />}
              </div>
            )}

            {/* Recent section */}
            {recentItems.length > 0 && !collapsed && (
              <div className="py-2">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <Clock4 className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    {t('nav.recent')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {recentItems.map(renderMenuItem)}
                </div>
                <Separator className="my-2" />
              </div>
            )}

            {/* Menu groups */}
            {permissionMenuGroups.map((group) => (
              <div key={group.label} className="py-2">
                {!collapsed && (
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    {group.icon && <span className="text-neutral-400">{group.icon}</span>}
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      {group.label}
                    </span>
                  </div>
                )}
                {collapsed && group.items.length > 0 && (
                  <div className="flex justify-center py-1">
                    <div className="h-px w-6 bg-sidebar-border" />
                  </div>
                )}
                <div className="space-y-0.5">
                  {group.items.map(renderMenuItem)}
                </div>
              </div>
            ))}
          </>
        )}
      </ScrollArea>
    </motion.aside>
  )
}

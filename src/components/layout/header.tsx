import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  PanelLeft,
  Search,
  Moon,
  Sun,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Command,
  Languages,
  Monitor,
  Sparkles,
} from 'lucide-react'
import { useSidebarStore, useThemeStore, useNotificationStore, useAuthStore, useSettingStore } from '@/stores'
import type { ThemeStyle } from '@/stores/setting'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { NotificationPanel } from './notification-panel'
import { WorkspaceSwitch } from './workspace-switch'

export function Header() {
  const { collapsed, toggle } = useSidebarStore()
  const { mode, setMode, toggle: toggleTheme } = useThemeStore()
  const { unreadCount } = useNotificationStore()
  const { username, logout, account } = useAuthStore()
  const { themeStyle, setThemeStyle } = useSettingStore()
  const { t, i18n } = useTranslation()
  const [notificationOpen, setNotificationOpen] = useState(false)

  // Command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const event = new CustomEvent('open-command-palette')
        window.dispatchEvent(event)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleLang = useCallback(() => {
    const next = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
  }, [i18n])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-14 glass flex items-center justify-between px-4 dark:shadow-[0_1px_0_rgba(124,58,237,0.06)]">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggle}>
                <PanelLeft className={cn('h-4 w-4 transition-transform duration-200', collapsed && 'rotate-180')} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{collapsed ? t('common.expand') : t('common.collapse')}</TooltipContent>
          </Tooltip>

          <Link to="/" className="flex items-center gap-2 select-none">
            <div className="h-7 w-7 rounded-[10px] bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.3)]">
              <span className="text-white text-xs font-bold">O</span>
            </div>
            <span className="font-bold text-sm gradient-text hidden sm:block">
              {t('app.shortName')}
            </span>
          </Link>

          {/* Workspace Switch */}
          <div className="hidden md:block ml-1">
            <WorkspaceSwitch />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Command palette hint */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-[10px] border border-neutral-200/80 dark:border-neutral-700/80 bg-neutral-50/80 dark:bg-neutral-800/80 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200"
              >
                <Search className="h-3 w-3" />
                <span className="mr-4">{t('common.search')}...</span>
                <kbd className="flex items-center gap-0.5 text-[10px] font-mono">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </button>
            </TooltipTrigger>
            <TooltipContent>{t('common.search')} (Ctrl+K)</TooltipContent>
          </Tooltip>

          {/* Language */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleLang}>
                <Languages className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{i18n.language === 'zh' ? 'English' : '中文'}</TooltipContent>
          </Tooltip>

          {/* Theme style cycle: default → anime → shinchan */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 relative',
                  themeStyle !== 'default' && 'text-primary-500',
                )}
                onClick={() => {
                  const styles: ThemeStyle[] = ['default', 'anime', 'shinchan']
                  const idx = styles.indexOf(themeStyle)
                  setThemeStyle(styles[(idx + 1) % styles.length])
                }}
              >
                <Sparkles className={cn('h-4 w-4 transition-all duration-300', themeStyle !== 'default' && 'scale-110')} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t(`theme.${themeStyle}`)}</TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
                {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  {mode === 'light' ? t('theme.light') : mode === 'dark' ? t('theme.dark') : t('theme.system')}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setMode('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    {t('theme.light')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMode('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    {t('theme.dark')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMode('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    {t('theme.system')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge variant="danger" size="sm" className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 flex items-center justify-center text-[10px]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('nav.notifications')}</TooltipContent>
          </Tooltip>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">{username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{username || 'User'}</span>
                <ChevronDown className="h-3 w-3 text-neutral-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{username}</span>
                  <span className="text-xs text-neutral-500">{account}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/personal-center" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  {t('nav.personalCenter')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/personal-center" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  {t('setting.title')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-danger-500 focus:text-danger-500">
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  )
}

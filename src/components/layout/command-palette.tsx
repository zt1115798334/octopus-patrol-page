import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutDashboard, Users, Shield, Key, FileText, Bot, Newspaper, Hash, Globe, UserCheck, Lock, Clock, CreditCard, History, Send, Settings, Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  keywords: string[]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const commands: CommandItem[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard className="h-4 w-4" />, path: '/', keywords: ['home', 'index'] },
    { id: 'user', label: t('nav.user'), icon: <Users className="h-4 w-4" />, path: '/user', keywords: ['users', 'account'] },
    { id: 'role', label: t('nav.role'), icon: <Shield className="h-4 w-4" />, path: '/role', keywords: ['roles', 'group'] },
    { id: 'menu', label: t('nav.menu'), icon: <Monitor className="h-4 w-4" />, path: '/menu', keywords: ['menus', 'navigation'] },
    { id: 'permission', label: t('nav.permission'), icon: <Key className="h-4 w-4" />, path: '/permission', keywords: ['permissions', 'auth'] },

    { id: 'log', label: t('nav.log'), icon: <FileText className="h-4 w-4" />, path: '/log', keywords: ['logs', 'audit'] },
    { id: 'ai-config', label: t('nav.aiConfig'), icon: <Bot className="h-4 w-4" />, path: '/ai-config', keywords: ['ai', 'config'] },
    { id: 'article', label: t('nav.article'), icon: <Newspaper className="h-4 w-4" />, path: '/article', keywords: ['articles', 'post'] },
    { id: 'comment-keyword', label: t('nav.commentKeyword'), icon: <Hash className="h-4 w-4" />, path: '/comment-keyword', keywords: ['keywords', 'comment'] },
    { id: 'platform', label: t('nav.platform'), icon: <Globe className="h-4 w-4" />, path: '/platform', keywords: ['platforms', 'social'] },
    { id: 'platform-account', label: t('nav.platformAccount'), icon: <UserCheck className="h-4 w-4" />, path: '/platform-account', keywords: ['accounts'] },
    { id: 'platform-permission', label: t('nav.platformPermission'), icon: <Lock className="h-4 w-4" />, path: '/platform-permission', keywords: [] },
    { id: 'job', label: t('nav.job'), icon: <Clock className="h-4 w-4" />, path: '/job', keywords: ['jobs', 'schedule', 'quartz'] },
    { id: 'pricing-plan', label: t('nav.pricingPlan'), icon: <CreditCard className="h-4 w-4" />, path: '/pricing-plan', keywords: ['plans', 'billing'] },
    { id: 'pricing-history', label: t('nav.pricingHistory'), icon: <History className="h-4 w-4" />, path: '/pricing-history', keywords: [] },
    { id: 'amqp', label: t('nav.amqp'), icon: <Send className="h-4 w-4" />, path: '/amqp', keywords: ['message', 'queue'] },
    { id: 'personal-center', label: t('nav.personalCenter'), icon: <Settings className="h-4 w-4" />, path: '/personal-center', keywords: ['settings', 'profile'] },
  ]

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())),
      )
    : commands

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('open-command-palette', openHandler)
    return () => window.removeEventListener('open-command-palette', openHandler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const execute = useCallback(
    (item: CommandItem) => {
      navigate(item.path)
      setOpen(false)
      setQuery('')
    },
    [navigate],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) execute(filtered[selectedIndex])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
            onClick={() => { setOpen(false); setQuery('') }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white dark:bg-neutral-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200/80 dark:border-neutral-700/80">
                <Search className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  className="flex-1 bg-transparent text-sm outline-none text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400"
                  placeholder={t('common.search') + '...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <kbd className="text-[10px] text-neutral-400 font-mono">ESC</kbd>
              </div>
              <div className="max-h-72 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <div className="py-8 text-center text-sm text-neutral-500">{t('common.noData')}</div>
                ) : (
                  filtered.map((item, index) => (
                    <button
                      key={item.id}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors duration-150 text-left',
                        index === selectedIndex
                          ? 'bg-primary-50/80 text-primary-700 dark:bg-primary-950/20 dark:text-primary-300'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80',
                      )}
                      onClick={() => execute(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className={cn(index === selectedIndex ? 'text-primary-500' : 'text-neutral-400')}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[10px] text-neutral-400">{item.path}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

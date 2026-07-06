import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useNotificationStore, type NotificationItem } from '@/stores'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'

const typeIcon = {
  info: <Info className="h-4 w-4 text-accent-500" />,
  success: <CheckCircle className="h-4 w-4 text-success-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning-500" />,
  error: <AlertCircle className="h-4 w-4 text-danger-500" />,
}

const typeBg = {
  info: 'bg-accent-50 dark:bg-accent-950/30',
  success: 'bg-success-50 dark:bg-success-950/30',
  warning: 'bg-warning-50 dark:bg-warning-950/30',
  error: 'bg-danger-50 dark:bg-danger-950/30',
}

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
}

function NotificationItemRow({
  notification,
  onMarkRead,
  onRemove,
}: {
  notification: NotificationItem
  onMarkRead: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'group relative flex gap-3 rounded-xl p-3 transition-colors',
        !notification.read
          ? 'bg-neutral-50 dark:bg-neutral-800/50'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/30',
      )}
    >
      {/* Dot indicator */}
      {!notification.read && (
        <div className="absolute left-1.5 top-4 h-2 w-2 rounded-full bg-primary-500" />
      )}

      {/* Icon */}
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', typeBg[notification.type])}>
        {typeIcon[notification.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm leading-snug', !notification.read && 'font-medium text-neutral-900 dark:text-neutral-50')}>
            {notification.title}
          </p>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.read && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                title="Mark as read"
              >
                <Check className="h-3 w-3 text-neutral-400" />
              </button>
            )}
            <button
              onClick={() => onRemove(notification.id)}
              className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="Remove"
            >
              <Trash2 className="h-3 w-3 text-neutral-400" />
            </button>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2">{notification.content}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[11px] text-neutral-400">{formatDate(notification.createdAt)}</span>
          {notification.link && (
            <Link
              to={notification.link}
              className="inline-flex items-center gap-0.5 text-[11px] text-primary-500 hover:text-primary-600"
            >
              View details
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore()
  const [tab, setTab] = useState('all')

  const filteredNotifications =
    tab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-4 top-14 z-50 w-full max-w-sm"
          >
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge variant="danger" size="sm" className="text-[10px]">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-7 text-xs gap-1"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Read all
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-7 text-xs text-neutral-500 hover:text-danger-500"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <div className="px-4 pt-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1 text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1 text-xs">
                      Unread
                      {unreadCount > 0 && (
                        <span className="ml-1 text-[10px]">{unreadCount}</span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-2">
                  {filteredNotifications.length === 0 ? (
                    <EmptyState
                      icon={<Bell className="h-8 w-8 text-neutral-300" />}
                      title="No notifications"
                      description="You're all caught up!"
                      className="py-12 border-0"
                    />
                  ) : (
                    <ScrollArea className="max-h-[360px]">
                      <div className="px-3 pb-3 space-y-1">
                        <AnimatePresence>
                          {filteredNotifications.map((notification) => (
                            <NotificationItemRow
                              key={notification.id}
                              notification={notification}
                              onMarkRead={markAsRead}
                              onRemove={removeNotification}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="unread" className="mt-2">
                  {filteredNotifications.length === 0 ? (
                    <EmptyState
                      icon={<CheckCircle className="h-8 w-8 text-neutral-300" />}
                      title="No unread notifications"
                      description="Everything is read!"
                      className="py-12 border-0"
                    />
                  ) : (
                    <ScrollArea className="max-h-[360px]">
                      <div className="px-3 pb-3 space-y-1">
                        <AnimatePresence>
                          {filteredNotifications.map((notification) => (
                            <NotificationItemRow
                              key={notification.id}
                              notification={notification}
                              onMarkRead={markAsRead}
                              onRemove={removeNotification}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

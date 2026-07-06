import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Users,
  UserPlus,
  FileText,
  LogIn,
  TrendingUp,
  TrendingDown,
  Clock,
  Trash2,
  Activity,
  Bot,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonCard, Skeleton } from '@/components/ui/skeleton'
import { getUserStatistics } from '@/api/modules/user'
import { getLogStatistics } from '@/api/modules/log'
import { getVisitStats, getVisitTrend } from '@/api/modules/dashboard'
import { formatNumber, formatPercent } from '@/lib/utils'
import { endOfDay, subDays } from 'date-fns'
import type { QueryVisitTrendDto } from '@/types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

function StatCard({
  title,
  value,
  icon,
  trend,
  loading,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend?: number
  loading?: boolean
}) {
  if (loading) return <SkeletonCard />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover padding="default">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-success-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-danger-500" />
                )}
                <span className={`text-xs ${trend >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                  {formatPercent(trend)}
                </span>
                <span className="text-xs text-neutral-400 ml-1">vs 昨日</span>
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <span className="text-primary-500">{icon}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()

  const trendQuery: QueryVisitTrendDto = {
    startDateTime: subDays(new Date(), 7).toISOString(),
    endDateTime: endOfDay(new Date()).toISOString(),
  }

  const { data: userStats, isLoading: userLoading } = useQuery({
    queryKey: ['userStatistics'],
    queryFn: getUserStatistics,
  })

  const { data: logStats, isLoading: logLoading } = useQuery({
    queryKey: ['logStatistics'],
    queryFn: getLogStatistics,
  })

  const { data: visitStats, isLoading: visitLoading } = useQuery({
    queryKey: ['visitStats', trendQuery],
    queryFn: () => getVisitStats(trendQuery),
  })

  const { data: trendData } = useQuery({
    queryKey: ['visitTrend', trendQuery],
    queryFn: () => getVisitTrend(trendQuery),
  })

  const us = userStats?.data
  const ls = logStats?.data

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('dashboard.title')}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {t('dashboard.welcome')} · {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalUsers')}
          value={formatNumber(us?.totalCount)}
          icon={<Users className="h-5 w-5" />}
          loading={userLoading}
        />
        <StatCard
          title={t('dashboard.todayNewUsers')}
          value={formatNumber(us?.todayNewCount)}
          icon={<UserPlus className="h-5 w-5" />}
          loading={userLoading}
        />
        <StatCard
          title={t('dashboard.normalUsers')}
          value={formatNumber(us?.normalCount)}
          icon={<Activity className="h-5 w-5" />}
          loading={userLoading}
        />
        <StatCard
          title={t('dashboard.disabledUsers')}
          value={formatNumber(us?.disabledCount)}
          icon={<Users className="h-5 w-5" />}
          loading={userLoading}
        />
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalLogs')}
          value={formatNumber(ls?.totalCount)}
          icon={<FileText className="h-5 w-5" />}
          loading={logLoading}
        />
        <StatCard
          title={t('dashboard.loginCount')}
          value={formatNumber(ls?.loginCount)}
          icon={<LogIn className="h-5 w-5" />}
          loading={logLoading}
        />
        <StatCard
          title={t('dashboard.deleteCount')}
          value={formatNumber(ls?.deleteCount)}
          icon={<Trash2 className="h-5 w-5" />}
          loading={logLoading}
        />
        <StatCard
          title={t('dashboard.highTimeConsuming')}
          value={formatNumber(ls?.highTimeConsumingCount)}
          icon={<Clock className="h-5 w-5" />}
          loading={logLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visit Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.visitTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            {!trendData ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trendData?.data || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-neutral-500" />
                  <YAxis tick={{ fontSize: 12 }} className="text-neutral-500" />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--color-neutral-200)',
                      background: 'white',
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--color-primary-500)" fillOpacity={1} fill="url(#colorVisit)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Visit Stats Pie */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.visitStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            {visitLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={visitStats?.data || []}
                    dataKey="totalCount"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {visitStats?.data?.map((_, index) => (
                      <Cell
                        key={index}
                        fill={['var(--color-primary-500)', 'var(--color-accent-500)', 'var(--color-success-500)', 'var(--color-warning-500)', 'var(--color-danger-500)'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--color-neutral-200)',
                      background: 'white',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Server Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.serverStatus')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: <Cpu className="h-4 w-4" />, label: t('dashboard.cpu'), value: 23, color: 'bg-success-500' },
              { icon: <HardDrive className="h-4 w-4" />, label: t('dashboard.memory'), value: 45, color: 'bg-warning-500' },
              { icon: <Wifi className="h-4 w-4" />, label: t('dashboard.network'), value: 60, color: 'bg-accent-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('nav.user'), icon: <Users className="h-5 w-5" />, href: '/user', color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-500' },
                { label: t('nav.role'), icon: <Shield className="h-5 w-5" />, href: '/role', color: 'bg-accent-100 dark:bg-accent-900/30 text-accent-500' },
                { label: t('nav.log'), icon: <FileText className="h-5 w-5" />, href: '/log', color: 'bg-success-100 dark:bg-success-900/30 text-success-500' },
                { label: t('nav.aiConfig'), icon: <Bot className="h-5 w-5" />, href: '/ai-config', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-500' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:shadow-md group"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{action.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

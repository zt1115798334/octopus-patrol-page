import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEnumCache } from '@/hooks/use-enum-cache'
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
  BarChart3,
  Zap,
  Gauge,
  Timer,
  Globe,
  Wifi,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonCard, Skeleton } from '@/components/ui/skeleton'
import { getUserStatistics } from '@/api/modules/user'
import { getLogStatistics } from '@/api/modules/log'
import {
  findVisitStats,
  findVisitTrend,
  findTimeConsumingStats,
  findHotEndpoints,
  findModuleDistribution,
  findSlowEndpoints,
  findHourlyVisitDistribution,
  findActiveUsers,
  findOperateRatio,
  findWeeklyCompare,
} from '@/api/modules/dashboard'
import { formatNumber, formatPercent } from '@/lib/utils'
import { endOfDay, format, subDays } from 'date-fns'
import type { QueryVisitTrendDto, QueryRankDto, QueryHourlyVisitDto, EnumValueDto } from '@/types'
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
  BarChart,
  Bar,
} from 'recharts'

// 访问趋势图各系列配色（循环使用）
const TREND_COLORS = [
  'var(--color-primary-500)',
  'var(--color-accent-500)',
  'var(--color-success-500)',
  'var(--color-warning-500)',
  'var(--color-danger-500)',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f59e0b',
]

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
            <p className="text-[1.75rem] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{value}</p>
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

  // 首页初次加载时，请求所有枚举数据并缓存到 localStorage
  useEnumCache()

  const trendQuery: QueryVisitTrendDto = {
    startDateTime: format(subDays(new Date(), 7), 'yyyy-MM-dd HH:mm:ss'),
    endDateTime: format(endOfDay(new Date()), 'yyyy-MM-dd HH:mm:ss'),
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
    queryKey: ['visitStats'],
    queryFn: findVisitStats,
  })

  // 从 localStorage enumPairsData 构建 VisitStatsType.name -> desc 标题映射（全页面复用）
  const visitStatsTitleMap = useMemo(() => {
    const map: Record<string, string> = {}
    try {
      const raw = localStorage.getItem('enumPairsData')
      const enumPairsData = raw ? JSON.parse(raw) : {}
      const enumList: EnumValueDto[] = enumPairsData['VisitStatsType'] || []
      enumList.forEach((e) => {
        if (e.name) map[e.name] = e.desc || e.name
      })
    } catch {
      // 解析异常时返回空映射
    }
    return map
  }, [])

  // 为访问统计列表附加中文 title（供饼图使用）
  const visitStatsWithTitle = useMemo(() => {
    const list = visitStats?.list || []
    return list.map((item) => ({
      ...item,
      title: item.type ? (visitStatsTitleMap[item.type] || item.type) : undefined,
    }))
  }, [visitStats?.list, visitStatsTitleMap])

  const { data: visitTrendRaw } = useQuery({
    queryKey: ['visitTrend', trendQuery],
    queryFn: () => findVisitTrend(trendQuery),
  })

  // 耗时统计
  const { data: timeConsuming } = useQuery({
    queryKey: ['timeConsumingStats'],
    queryFn: findTimeConsumingStats,
  })

  // 本周 vs 上周对比
  const { data: weeklyCompare } = useQuery({
    queryKey: ['weeklyCompare'],
    queryFn: findWeeklyCompare,
  })

  const rankQuery: QueryRankDto = { limit: 10 }

  // 热门接口排行
  const { data: hotEndpoints } = useQuery({
    queryKey: ['hotEndpoints', rankQuery],
    queryFn: () => findHotEndpoints(rankQuery),
  })

  // 慢接口排行
  const { data: slowEndpoints } = useQuery({
    queryKey: ['slowEndpoints', rankQuery],
    queryFn: () => findSlowEndpoints(rankQuery),
  })

  // 活跃用户排行
  const { data: activeUsers } = useQuery({
    queryKey: ['activeUsers', rankQuery],
    queryFn: () => findActiveUsers(rankQuery),
  })

  // 模块分布
  const { data: moduleDistribution } = useQuery({
    queryKey: ['moduleDistribution'],
    queryFn: findModuleDistribution,
  })

  // 操作类型占比
  const { data: operateRatio } = useQuery({
    queryKey: ['operateRatio'],
    queryFn: findOperateRatio,
  })

  // 按小时访问分布
  const hourlyQuery: QueryHourlyVisitDto = { date: format(new Date(), 'yyyy-MM-dd') }
  const { data: hourlyVisit } = useQuery({
    queryKey: ['hourlyVisit', hourlyQuery],
    queryFn: () => findHourlyVisitDistribution(hourlyQuery),
  })

  // 将后端 { PV: [], IP: [], ..., date: [] } 转换为图表格式 [{date, PV, IP, ...}, ...]
  const trendData = (() => {
    const obj = visitTrendRaw?.obj
    if (!obj?.date) return undefined
    const dates: string[] = obj.date
    const seriesKeys = Object.keys(obj).filter((k) => k !== 'date')
    return dates.map((d, i) => {
      const point: Record<string, string | number> = { date: d }
      seriesKeys.forEach((key) => {
        point[key] = Number(obj[key]?.[i]) || 0
      })
      return point
    })
  })()

  // 趋势图各系列字段名（排除 date），用于动态渲染并设置中文标题
  const trendSeriesKeys = useMemo(() => {
    const obj = visitTrendRaw?.obj
    if (!obj) return []
    return Object.keys(obj).filter((k) => k !== 'date')
  }, [visitTrendRaw?.obj])

  const us = userStats?.obj
  const ls = logStats?.obj
  // 耗时统计：通过 enumPairsData 的 VisitStatsType 映射中文 title
  const tcList = (timeConsuming?.list ?? []).map((item) => ({
    ...item,
    title: item.type ? (visitStatsTitleMap[item.type] || item.type) : undefined,
  }))
  const wc = weeklyCompare?.obj
  const hotList = hotEndpoints?.list ?? []
  const slowList = slowEndpoints?.list ?? []
  const modList = moduleDistribution?.list ?? []
  const ratioList = operateRatio?.list ?? []
  const hourList = hourlyVisit?.list ?? []
  const userList = activeUsers?.list ?? []

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
                <AreaChart data={trendData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    {trendSeriesKeys.map((key, i) => (
                      <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TREND_COLORS[i % TREND_COLORS.length]} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={TREND_COLORS[i % TREND_COLORS.length]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-neutral-500" />
                  <YAxis tick={{ fontSize: 12 }} className="text-neutral-500" />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--color-neutral-200)',
                      background: 'white',
                      color: 'var(--color-neutral-900)',
                    }}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {trendSeriesKeys.map((key, i) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={visitStatsTitleMap[key] || key}
                      stroke={TREND_COLORS[i % TREND_COLORS.length]}
                      fillOpacity={1}
                      fill={`url(#color${key})`}
                      strokeWidth={2}
                    />
                  ))}
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
                    data={visitStatsWithTitle}
                    dataKey="totalCount"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {visitStatsWithTitle.map((_, index) => (
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
                      color: 'var(--color-neutral-900)',
                    }}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Time Consuming Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tcList.map((item) => (
          <Card key={item.title} hover padding="default">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.title}</p>
                <p className="text-[1.75rem] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {item.todayCount ?? 0}ms
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-400">昨日 {item.yesterdayCount ?? 0}ms</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100 dark:bg-warning-900/30">
                <Timer className="h-5 w-5 text-warning-500" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Compare */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card hover padding="default">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">PV（页面访问量）</p>
              <p className="text-[1.75rem] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {formatNumber(wc?.thisWeekPv)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">上周 {formatNumber(wc?.lastWeekPv)}</span>
                {wc?.pvGrowthRate !== undefined && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${wc.pvGrowthRate >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                    {wc.pvGrowthRate >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {formatPercent(Math.abs(wc.pvGrowthRate))}
                  </span>
                )}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <Globe className="h-5 w-5 text-primary-500" />
            </div>
          </div>
        </Card>
        <Card hover padding="default">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">独立 IP</p>
              <p className="text-[1.75rem] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {formatNumber(wc?.thisWeekIp)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">上周 {formatNumber(wc?.lastWeekIp)}</span>
                {wc?.ipGrowthRate !== undefined && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${wc.ipGrowthRate >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                    {wc.ipGrowthRate >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {formatPercent(Math.abs(wc.ipGrowthRate))}
                  </span>
                )}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 dark:bg-accent-900/30">
              <Wifi className="h-5 w-5 text-accent-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Hot Endpoints + Slow Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-warning-500" />热门接口 Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotList.length === 0 && <p className="text-sm text-neutral-400">暂无数据</p>}
              {hotList.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-neutral-400 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate">{item.name}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-primary-500 transition-all"
                        style={{ width: `${Math.min(((item.count ?? 0) / Math.max(...hotList.map((h) => h.count ?? 1))) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-neutral-500 w-16 text-right">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gauge className="h-5 w-5 text-danger-500" />慢接口 Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slowList.length === 0 && <p className="text-sm text-neutral-400">暂无数据</p>}
              {slowList.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-neutral-400 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate">{item.name}</p>
                    <p className="text-xs text-neutral-400">最大 {item.maxTimeConsuming ?? 0}ms · 平均 {item.avgTimeConsuming ?? 0}ms</p>
                  </div>
                  <span className="text-sm font-medium text-neutral-500 w-16 text-right">{formatNumber(item.count)}次</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Visit Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary-500" />今日访问时段分布</CardTitle>
        </CardHeader>
        <CardContent>
          {hourList.length === 0 ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hourList} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} className="text-neutral-500" tickFormatter={(h: number) => `${h}时`} />
                <YAxis tick={{ fontSize: 12 }} className="text-neutral-500" />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--color-neutral-200)',
                    background: 'white',
                    color: 'var(--color-neutral-900)',
                  }}
                  formatter={(value: number) => [`${value} 次`, '访问量']}
                  labelFormatter={(h: number) => `${h}:00 - ${h}:59`}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="var(--color-primary-500)" opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Module Distribution + Operate Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>模块访问分布</CardTitle>
          </CardHeader>
          <CardContent>
            {modList.length === 0 ? (
              <Skeleton className="h-60 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={modList}
                    dataKey="count"
                    nameKey="module"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {modList.map((_, i) => (
                      <Cell key={i} fill={['var(--color-primary-500)', 'var(--color-accent-500)', 'var(--color-success-500)', 'var(--color-warning-500)', 'var(--color-danger-500)', '#8b5cf6', '#ec4899', '#06b6d4'][i % 8]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--color-neutral-200)',
                      background: 'white',
                      color: 'var(--color-neutral-900)',
                    }}
                    formatter={(value: number, _: string, entry: any) => [`${value} 次`, `${entry.payload.module} (${entry.payload.percentage}%)`]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>操作类型占比</CardTitle>
          </CardHeader>
          <CardContent>
            {ratioList.length === 0 ? (
              <Skeleton className="h-60 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={ratioList}
                    dataKey="count"
                    nameKey="operate"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {ratioList.map((_, i) => (
                      <Cell key={i} fill={['var(--color-primary-500)', 'var(--color-accent-500)', 'var(--color-success-500)', 'var(--color-warning-500)', 'var(--color-danger-500)', '#8b5cf6', '#ec4899'][i % 7]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--color-neutral-200)',
                      background: 'white',
                      color: 'var(--color-neutral-900)',
                    }}
                    formatter={(value: number, _: string, entry: any) => [`${value} 次`, `${entry.payload.operate} (${entry.payload.percentage}%)`]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Users Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-success-500" />活跃用户排行 Top 10</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {userList.length === 0 && <p className="text-sm text-neutral-400">暂无数据</p>}
            {userList.map((item, i) => (
              <div
                key={item.userId}
                className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80"
              >
                <span className={`text-xs font-bold w-5 text-right ${i < 3 ? 'text-warning-500' : 'text-neutral-400'}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate flex-1">
                  {item.userName ? item.userName : `ID: ${item.userId}`}
                </span>
                <span className="text-xs text-neutral-400">{formatNumber(item.count)}次</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Search, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonTable, SkeletonCard } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { findLogPage, getLogStatistics } from '@/api/modules/log'
import { formatDate, formatDuration, formatNumber } from '@/lib/utils'
import { subDays, endOfDay } from 'date-fns'
import type { QueryLogDto } from '@/types'

export default function LogManagement() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keywords, setKeywords] = useState('')

  const logQuery: QueryLogDto = { pageNumber: page, pageSize, keywords: keywords || undefined }
  const { data, isLoading } = useQuery({ queryKey: ['logs', logQuery], queryFn: () => findLogPage(logQuery) })
  const { data: statsData, isLoading: statsLoading } = useQuery({ queryKey: ['logStats'], queryFn: getLogStatistics })

  const stats = statsData?.data
  const items = data?.data?.content || []
  const total = data?.data?.totalElements || 0

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('log.title')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <Card hover><CardHeader className="pb-2"><CardTitle className="text-sm text-neutral-500">{t('dashboard.totalLogs')}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatNumber(stats?.totalCount)}</p></CardContent></Card>
            <Card hover><CardHeader className="pb-2"><CardTitle className="text-sm text-neutral-500">{t('dashboard.loginCount')}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatNumber(stats?.loginCount)}</p></CardContent></Card>
            <Card hover><CardHeader className="pb-2"><CardTitle className="text-sm text-neutral-500">{t('dashboard.deleteCount')}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatNumber(stats?.deleteCount)}</p></CardContent></Card>
            <Card hover><CardHeader className="pb-2"><CardTitle className="text-sm text-neutral-500">{t('dashboard.highTimeConsuming')}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatNumber(stats?.highTimeConsumingCount)}</p></CardContent></Card>
          </>
        )}
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><Input placeholder={t('common.keywordSearch')} className="pl-9" value={keywords} onChange={(e) => { setKeywords(e.target.value); setPage(1) }} onKeyDown={(e) => e.key === 'Enter' && queryClient.invalidateQueries({ queryKey: ['logs'] })} /></div>
            <Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['logs'] })}><RefreshCw className="h-4 w-4" /></Button>
          </div>
          {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState /> : (
            <Table>
              <TableHeader><TableRow><TableHead>{t('log.operator')}</TableHead><TableHead>{t('log.type')}</TableHead><TableHead>{t('log.ip')}</TableHead><TableHead>{t('log.time')}</TableHead><TableHead>{t('log.duration')}</TableHead></TableRow></TableHeader>
              <TableBody>{items.map((log) => (
                <TableRow key={log.id}><TableCell className="font-medium">{log.name || '-'}</TableCell><TableCell>{log.operate || log.type || '-'}</TableCell><TableCell>{log.ip ? String(log.ip) : '-'}</TableCell><TableCell className="text-sm text-neutral-500">{formatDate(log.createdTime)}</TableCell><TableCell className="font-mono text-sm">{formatDuration(log.timeConsuming)}</TableCell></TableRow>
              ))}</TableBody>
            </Table>
          )}
          {total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
        </CardContent>
      </Card>
    </div>
  )
}

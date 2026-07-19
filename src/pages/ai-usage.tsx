import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Search, RefreshCw, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { findAiUsageRecordPage } from '@/api/modules/ai-usage'
import { formatDate, formatNumber } from '@/lib/utils'
import type { AiUsageRecordDto, QueryAiUsageRecordDto } from '@/types'

const vendorLabels: Record<string, string> = { OPENAI: 'OpenAI', DEEPSEEK: 'DeepSeek', ZHIPU: '智谱', TONGYI: '通义', CUSTOM: '自定义' }

export default function AiUsageManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [pageSize] = useState(10); const [keywords, setKeywords] = useState('')
  const [detailItem, setDetailItem] = useState<AiUsageRecordDto | null>(null)

  const query: QueryAiUsageRecordDto = { pageNumber: page, pageSize, keywords: keywords || undefined }
  const { data, isLoading } = useQuery({ queryKey: ['aiUsage', query], queryFn: () => findAiUsageRecordPage(query) })

  const items = data?.page?.list || []; const total = data?.page?.total || 0

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">AI使用记录</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><Input placeholder={t('common.keywordSearch')} className="pl-9" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && queryClient.invalidateQueries({ queryKey: ['aiUsage'] })} /></div><Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['aiUsage'] })}><RefreshCw className="h-4 w-4" /></Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState /> : (
          <Table><TableHeader><TableRow><TableHead>用户</TableHead><TableHead>AI配置</TableHead><TableHead>厂商</TableHead><TableHead>模型</TableHead><TableHead>Token消耗</TableHead><TableHead>费用</TableHead><TableHead>时间</TableHead><TableHead className="w-16">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell className="font-medium">{item.username || '-'}</TableCell><TableCell>{item.configName || '-'}</TableCell><TableCell><Badge variant="info">{vendorLabels[item.vendor || ''] || item.vendor || '-'}</Badge></TableCell><TableCell className="font-mono text-xs">{item.model || '-'}</TableCell><TableCell className="font-mono text-sm">{formatNumber(item.tokenUsed)}</TableCell><TableCell className="text-sm">¥{(item.cost || 0).toFixed(4)}</TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.createdTime)}</TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailItem(item)}><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}{total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
      </CardContent></Card>
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>使用详情</DialogTitle></DialogHeader><div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-neutral-500">用户：</span>{detailItem?.username || '-'}</div>
            <div><span className="text-neutral-500">AI配置：</span>{detailItem?.configName || '-'}</div>
            <div><span className="text-neutral-500">厂商：</span><Badge variant="info">{vendorLabels[detailItem?.vendor || ''] || detailItem?.vendor || '-'}</Badge></div>
            <div><span className="text-neutral-500">模型：</span><Badge variant="outline" className="font-mono">{detailItem?.model || '-'}</Badge></div>
            <div><span className="text-neutral-500">Token消耗：</span>{formatNumber(detailItem?.tokenUsed)}</div>
            <div><span className="text-neutral-500">费用：</span>¥{(detailItem?.cost || 0).toFixed(4)}</div>
            <div><span className="text-neutral-500">时间：</span>{formatDate(detailItem?.createdTime)}</div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-neutral-500">输入 (Prompt)</h4>
            <pre className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 text-xs overflow-auto max-h-40 whitespace-pre-wrap border">{detailItem?.prompt || '-'}</pre>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-neutral-500">输出 (Response)</h4>
            <pre className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 text-xs overflow-auto max-h-60 whitespace-pre-wrap border">{detailItem?.response || '-'}</pre>
          </div>
      </div></DialogContent></Dialog>
    </div>
  )
}

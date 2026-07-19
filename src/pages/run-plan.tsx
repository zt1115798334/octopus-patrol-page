import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Pencil, Search, RefreshCw, MoreHorizontal, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { findPlatformSchemePage, savePlatformScheme, deletePlatformScheme, runPlatformScheme } from '@/api/modules/platform-scheme'
import { formatDate } from '@/lib/utils'
import type { PlatformSchemeDto, QueryPlatformSchemeDto } from '@/types'

const formSchema = z.object({
  platformCode: z.string().optional(),
  platformAccountId: z.number().optional(),
  requestParams: z.string().optional(),
  description: z.string().optional(),
  enabledState: z.string().optional(),
})
type FormData = z.infer<typeof formSchema>

const platformLabels: Record<string, string> = { XHS: '小红书' }

export default function RunPlanManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [pageSize] = useState(10); const [keywords, setKeywords] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false); const [editing, setEditing] = useState<PlatformSchemeDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const query: QueryPlatformSchemeDto = { pageNumber: page, pageSize, keywords: keywords || undefined }
  const { data, isLoading } = useQuery({ queryKey: ['platformSchemes', query], queryFn: () => findPlatformSchemePage(query) })
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const saveMutation = useMutation({ mutationFn: savePlatformScheme, onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['platformSchemes'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const deleteMutation = useMutation({ mutationFn: deletePlatformScheme, onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['platformSchemes'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const runMutation = useMutation({ mutationFn: runPlatformScheme, onSuccess: () => { toast.success('运行任务已触发'); queryClient.invalidateQueries({ queryKey: ['platformSchemes'] }) }, onError: () => toast.error('运行失败') })

  const handleEdit = useCallback((item: PlatformSchemeDto) => { setEditing(item); form.reset({ platformCode: item.platformCode || '', platformAccountId: item.platformAccountId, requestParams: item.requestParams || '', description: item.description || '', enabledState: item.enabledState || 'ON' }); setDialogOpen(true) }, [form])
  const handleCreate = useCallback(() => { setEditing(null); form.reset({ platformCode: '', platformAccountId: undefined, requestParams: '', description: '', enabledState: 'ON' }); setDialogOpen(true) }, [form])
  const handleSubmit = useCallback((d: FormData) => { saveMutation.mutate({ id: editing?.id, ...d } as PlatformSchemeDto) }, [editing, saveMutation])

  const items = data?.page?.list || []; const total = data?.page?.total || 0

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">运行方案</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div><Button onClick={handleCreate}><Plus className="h-4 w-4" />{t('common.create')}</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><Input placeholder={t('common.keywordSearch')} className="pl-9" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && queryClient.invalidateQueries({ queryKey: ['platformSchemes'] })} /></div><Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['platformSchemes'] })}><RefreshCw className="h-4 w-4" /></Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState onAction={handleCreate} actionLabel={t('common.create')} /> : (
          <Table><TableHeader><TableRow><TableHead>平台</TableHead><TableHead>描述</TableHead><TableHead>请求参数</TableHead><TableHead>{t('common.status')}</TableHead><TableHead>创建时间</TableHead><TableHead className="w-20">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell><Badge variant="info">{platformLabels[item.platformCode || ''] || item.platformCode || '-'}</Badge></TableCell><TableCell className="max-w-[200px] truncate text-sm">{item.description || '-'}</TableCell><TableCell className="max-w-[150px] truncate font-mono text-xs text-neutral-500">{item.requestParams || '-'}</TableCell><TableCell><Badge variant={item.enabledState === 'ON' ? 'success' : 'danger'} dot>{item.enabledState === 'ON' ? t('common.enabled') : t('common.disabled')}</Badge></TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.createdTime)}</TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => item.id && runMutation.mutate(item.id)}><Play className="h-4 w-4 mr-2" />运行</DropdownMenuItem><DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="h-4 w-4 mr-2" />{t('common.edit')}</DropdownMenuItem><DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(item.id!)}><Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}{total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')} 运行方案</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4"><Select value={form.watch('platformCode')} onValueChange={(v) => form.setValue('platformCode', v)}><SelectTrigger><SelectValue placeholder="选择平台" /></SelectTrigger><SelectContent>{Object.entries(platformLabels).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}</SelectContent></Select><Textarea label="请求参数 (JSON)" rows={4} {...form.register('requestParams')} placeholder='{"key": "value"}' /><Input label="描述" {...form.register('description')} /><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

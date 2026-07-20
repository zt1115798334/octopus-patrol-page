import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Pencil, RefreshCw, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'
import { findPlatformPage, savePlatform, deletePlatform, changePlatformEnabledState } from '@/api/modules/platform'
import { useEnumCache } from '@/hooks'
import { formatDate } from '@/lib/utils'
import type { PlatformDto, QueryPlatformDto, EnabledState, SavePlatformDto, EnumValueDto, PlatformCode } from '@/types'

const formSchema = z.object({ platformName: z.string().min(1, '请输入平台名称'), platformCode: z.string().optional(), description: z.string().optional(), enabledState: z.string().optional() })
type FormData = z.infer<typeof formSchema>

export default function PlatformManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [pageSize] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false); const [editing, setEditing] = useState<PlatformDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  // 确保枚举数据已缓存到 localStorage（首页未访问时也可读取 PlatformCode）
  useEnumCache()

  // 从 localStorage 读取 PlatformCode 枚举列表，供新增/编辑表单下拉选择
  const platformCodeOptions = useMemo<EnumValueDto[]>(() => {
    try {
      const raw = localStorage.getItem('enumPairsData')
      const enumPairsData = raw ? JSON.parse(raw) : {}
      return enumPairsData['PlatformCode'] || []
    } catch {
      return []
    }
  }, [])

  // PlatformCode 枚举 name -> desc 映射，用于表格展示中文名称
  const platformCodeDescMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    platformCodeOptions.forEach((e) => {
      if (e.name) map[e.name] = e.desc || e.name
    })
    return map
  }, [platformCodeOptions])

  const query: QueryPlatformDto = { pageNumber: page, pageSize }
  const { data, isLoading } = useQuery({ queryKey: ['platforms', query], queryFn: () => findPlatformPage(query) })
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const saveMutation = useMutation({ mutationFn: savePlatform, onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['platforms'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const deleteMutation = useMutation({ mutationFn: deletePlatform, onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['platforms'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const toggleMutation = useMutation({ mutationFn: changePlatformEnabledState, onSuccess: () => { toast.success(t('common.operationSuccess')); queryClient.invalidateQueries({ queryKey: ['platforms'] }) }, onError: () => toast.error(t('common.operationFailed')) })

  const handleEdit = useCallback((item: PlatformDto) => { setEditing(item); form.reset({ platformName: item.platformName || '', platformCode: item.platformCode || '', description: item.description || '', enabledState: item.enabledState || 'ON' }); setDialogOpen(true) }, [form])
  const handleCreate = useCallback(() => { setEditing(null); form.reset({ platformName: '', platformCode: '', description: '', enabledState: 'ON' }); setDialogOpen(true) }, [form])
  const handleSubmit = useCallback((d: FormData) => {
    const payload: SavePlatformDto = {
      id: editing?.id,
      platformName: d.platformName,
      platformCode: d.platformCode as PlatformCode | undefined,
      description: d.description,
      enabledState: d.enabledState as EnabledState | undefined,
    }
    saveMutation.mutate(payload)
  }, [editing, saveMutation])

  const items = data?.page?.list || []; const total = data?.page?.total || 0

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('platform.title')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div><Button onClick={handleCreate}><Plus className="h-4 w-4" />{t('common.create')}</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['platforms'] })}><RefreshCw className="h-4 w-4 mr-2" />{t('common.refresh')}</Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState onAction={handleCreate} actionLabel={t('common.create')} /> : (
          <Table><TableHeader><TableRow><TableHead>{t('platform.name')}</TableHead><TableHead>{t('platform.code')}</TableHead><TableHead>{t('platform.description')}</TableHead><TableHead>{t('common.status')}</TableHead><TableHead>{t('platform.createdTime')}</TableHead><TableHead className="w-16">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell className="font-medium">{item.platformName}</TableCell><TableCell><Badge variant="info">{platformCodeDescMap[item.platformCode ?? ''] ?? item.platformCode}</Badge></TableCell><TableCell className="text-sm text-neutral-500">{item.description || '-'}</TableCell><TableCell><Badge variant={item.enabledState === 'ON' ? 'success' : 'danger'} dot>{item.enabledState === 'ON' ? t('common.enabled') : t('common.disabled')}</Badge></TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.createdTime, 'yyyy-MM-dd')}</TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="h-4 w-4 mr-2" />{t('common.edit')}</DropdownMenuItem><DropdownMenuItem onClick={() => toggleMutation.mutate({ id: item.id!, enabledState: item.enabledState === 'ON' ? 'OFF' as EnabledState : 'ON' as EnabledState })}>{item.enabledState === 'ON' ? t('common.disabled') : t('common.enabled')}</DropdownMenuItem><DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(item.id!)}><Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}{total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')}</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4"><Input label={t('platform.name')} {...form.register('platformName')} error={form.formState.errors.platformName?.message} />
<Select value={form.watch('platformCode') || undefined} onValueChange={(v) => form.setValue('platformCode', v, { shouldValidate: true })}>
  <SelectTrigger label={t('platform.code')}>
    <SelectValue placeholder={t('platform.selectCode')} />
  </SelectTrigger>
  <SelectContent>
    {platformCodeOptions.map((opt) => (
      <SelectItem key={opt.code} value={opt.name!}>{opt.desc}</SelectItem>
    ))}
  </SelectContent>
</Select>
<Input label={t('platform.description')} {...form.register('description')} />
<Select value={form.watch('enabledState') || undefined} onValueChange={(v) => form.setValue('enabledState', v, { shouldValidate: true })}>
  <SelectTrigger label={t('platform.enabledState')}>
    <SelectValue placeholder={t('platform.selectEnabledState')} />
  </SelectTrigger>
  <SelectContent>
    {(['ON', 'OFF'] as EnabledState[]).map((state) => (
      <SelectItem key={state} value={state}>{state === 'ON' ? t('common.enabled') : t('common.disabled')}</SelectItem>
    ))}
  </SelectContent>
</Select>
<DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

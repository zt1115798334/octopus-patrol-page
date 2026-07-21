import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Pencil, Search, RefreshCw, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { findPlatformAccountPage, savePlatformAccount, deletePlatformAccount, changePlatformAccountEnabledState } from '@/api/modules/platform-account'
import { findOnPlatforms } from '@/api/modules/platform'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import type { PlatformAccountDto, QueryPlatformAccountDto, EnabledState, PlatformDto } from '@/types'

const formSchema = z.object({
  account: z.string().min(1, '请输入账号'),
  password: z.string().optional(),
  platformId: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().optional()),
  platformCode: z.string().optional(),
  enabledState: z.string().optional(),
  cookie: z.string().optional(),
  accessToken: z.string().optional(),
  wToken: z.string().optional(),
  safeUniqueCode: z.string().optional(),
})
type FormData = z.infer<typeof formSchema>

export default function PlatformAccountManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [pageSize] = useState(10); const [keywords, setKeywords] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false); const [editing, setEditing] = useState<PlatformAccountDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const query: QueryPlatformAccountDto = { pageNumber: page, pageSize, keywords }
  const { data, isLoading } = useQuery({ queryKey: ['platformAccounts', query], queryFn: () => findPlatformAccountPage(query) })
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const { data: platformsData } = useQuery({ queryKey: ['onPlatforms'], queryFn: () => findOnPlatforms(), enabled: dialogOpen })
  const platforms = platformsData?.list || []

  const saveMutation = useMutation({ mutationFn: savePlatformAccount, onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['platformAccounts'] }) }, onError: () => {} })
  const deleteMutation = useMutation({ mutationFn: deletePlatformAccount, onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['platformAccounts'] }) }, onError: () => {} })
  const toggleMutation = useMutation({ mutationFn: changePlatformAccountEnabledState, onSuccess: () => { toast.success(t('common.operationSuccess')); queryClient.invalidateQueries({ queryKey: ['platformAccounts'] }) }, onError: () => {} })

  const handleEdit = useCallback((item: PlatformAccountDto) => {
    setEditing(item)
    form.reset({
      account: item.account || '',
      password: '',
      platformId: item.platformId,
      platformCode: item.platformCode || '',
      enabledState: item.enabledState || 'ON',
      cookie: item.cookie || '',
      accessToken: item.accessToken || '',
      wToken: item.wToken || '',
      safeUniqueCode: item.safeUniqueCode || '',
    })
    setDialogOpen(true)
  }, [form])
  const handleCreate = useCallback(() => {
    setEditing(null)
    form.reset({
      account: '',
      password: '',
      platformId: undefined,
      platformCode: '',
      enabledState: 'ON',
      cookie: '',
      accessToken: '',
      wToken: '',
      safeUniqueCode: '',
    })
    setDialogOpen(true)
  }, [form])
  const handleSubmit = useCallback((d: FormData) => {
    saveMutation.mutate({ id: editing?.id, ...d } as PlatformAccountDto)
  }, [editing, saveMutation])

  const items = data?.page?.list || []; const total = data?.page?.total || 0

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('nav.platformAccount')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div><Button onClick={handleCreate}><Plus className="h-4 w-4" />{t('common.create')}</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><Input placeholder={t('common.keywordSearch')} className="pl-9" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && queryClient.invalidateQueries({ queryKey: ['platformAccounts'] })} /></div><Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['platformAccounts'] })}><RefreshCw className="h-4 w-4" /></Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState onAction={handleCreate} actionLabel={t('common.create')} /> : (
          <Table><TableHeader><TableRow><TableHead>账号</TableHead><TableHead>平台</TableHead><TableHead>平台编码</TableHead><TableHead>{t('common.status')}</TableHead><TableHead>创建时间</TableHead><TableHead className="w-28">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell className="font-medium">{item.account}</TableCell><TableCell>{item.platformName || '-'}</TableCell><TableCell><Badge variant="info">{item.platformCode}</Badge></TableCell><TableCell><Badge variant={item.enabledState === 'ON' ? 'success' : 'danger'} dot>{item.enabledState === 'ON' ? t('common.enabled') : t('common.disabled')}</Badge></TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.createdTime)}</TableCell>
                <TableCell><div className="flex items-center gap-2"><Switch checked={item.enabledState === 'ON'} onCheckedChange={() => toggleMutation.mutate({ id: item.id!, enabledState: item.enabledState === 'ON' ? 'OFF' as EnabledState : 'ON' as EnabledState })} /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="h-4 w-4 mr-2" />{t('common.edit')}</DropdownMenuItem><DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(item.id!)}><Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}{total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')}</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3"><div className="grid grid-cols-2 gap-3"><Input label={t('platformAccount.account')} {...form.register('account')} error={form.formState.errors.account?.message} /><Input label={t('platformAccount.password')} type="password" placeholder={editing ? '留空则不修改' : ''} {...form.register('password')} /></div>
    <Select
      value={form.watch('platformId')?.toString() || ''}
      onValueChange={(value) => {
        const p = platforms.find((p) => p.id?.toString() === value)
        form.setValue('platformId', Number(value))
        form.setValue('platformCode', p?.platformCode || '')
      }}
    >
      <SelectTrigger label={t('platformAccount.platform')}>
        <SelectValue placeholder="请选择平台" />
      </SelectTrigger>
      <SelectContent>
        {platforms.map((p) => (
          <SelectItem key={p.id} value={p.id?.toString() || ''}>
            {p.platformName} ({p.platformCode})
          </SelectItem>
        ))}
      </SelectContent>
    </Select><Input label={t('platformAccount.cookie')} {...form.register('cookie')} /><div className="grid grid-cols-2 gap-3"><Input label={t('platformAccount.accessToken')} {...form.register('accessToken')} /><Input label={t('platformAccount.wToken')} {...form.register('wToken')} /></div><Input label={t('platformAccount.safeUniqueCode')} {...form.register('safeUniqueCode')} /><div className="flex items-center gap-3"><span className="text-sm font-medium">{t('platform.enabledState')}</span><Switch checked={form.watch('enabledState') === 'ON'} onCheckedChange={(checked) => form.setValue('enabledState', checked ? 'ON' : 'OFF', { shouldValidate: true })} /><span className="text-sm text-neutral-500">{form.watch('enabledState') === 'ON' ? t('common.enabled') : t('common.disabled')}</span></div><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

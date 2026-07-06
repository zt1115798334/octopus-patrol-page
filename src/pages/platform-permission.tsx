import { useState, useCallback } from 'react'
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
import { toast } from 'sonner'
import { findPlatformPermissionPage, savePlatformPermission, deletePlatformPermission, changePlatformPermissionEnabledState } from '@/api/modules/platform-permission'
import { formatDate } from '@/lib/utils'
import type { PlatformPermissionDto, QueryPlatformPermissionDto, EnabledState } from '@/types'

const formSchema = z.object({ userId: z.number().optional(), platformId: z.number().optional(), enabledState: z.string().optional() })
type FormData = z.infer<typeof formSchema>

export default function PlatformPermissionManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [pageSize] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false); const [editing, setEditing] = useState<PlatformPermissionDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const query: QueryPlatformPermissionDto = { pageNumber: page, pageSize }
  const { data, isLoading } = useQuery({ queryKey: ['platformPermissions', query], queryFn: () => findPlatformPermissionPage(query) })
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const saveMutation = useMutation({ mutationFn: savePlatformPermission, onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['platformPermissions'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const deleteMutation = useMutation({ mutationFn: deletePlatformPermission, onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['platformPermissions'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const toggleMutation = useMutation({ mutationFn: changePlatformPermissionEnabledState, onSuccess: () => { toast.success(t('common.operationSuccess')); queryClient.invalidateQueries({ queryKey: ['platformPermissions'] }) }, onError: () => toast.error(t('common.operationFailed')) })

  const handleEdit = useCallback((item: PlatformPermissionDto) => { setEditing(item); form.reset({ userId: item.userId, platformId: item.platformId, enabledState: item.enabledState || 'ON' }); setDialogOpen(true) }, [form])
  const handleCreate = useCallback(() => { setEditing(null); form.reset({ userId: undefined, platformId: undefined, enabledState: 'ON' }); setDialogOpen(true) }, [form])
  const handleSubmit = useCallback((d: FormData) => { saveMutation.mutate({ id: editing?.id, ...d }) }, [editing, saveMutation])

  const items = data?.data?.content || []; const total = data?.data?.totalElements || 0

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('nav.platformPermission')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div><Button onClick={handleCreate}><Plus className="h-4 w-4" />{t('common.create')}</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['platformPermissions'] })}><RefreshCw className="h-4 w-4 mr-2" />{t('common.refresh')}</Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState onAction={handleCreate} actionLabel={t('common.create')} /> : (
          <Table><TableHeader><TableRow><TableHead>用户ID</TableHead><TableHead>平台</TableHead><TableHead>平台编码</TableHead><TableHead>{t('common.status')}</TableHead><TableHead>创建时间</TableHead><TableHead className="w-16">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell>{item.userId}</TableCell><TableCell>{item.platformName || '-'}</TableCell><TableCell><Badge variant="info">{item.platformCode}</Badge></TableCell><TableCell><Badge variant={item.enabledState === 'ON' ? 'success' : 'danger'} dot>{item.enabledState === 'ON' ? t('common.enabled') : t('common.disabled')}</Badge></TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.createdTime)}</TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="h-4 w-4 mr-2" />{t('common.edit')}</DropdownMenuItem><DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(item.id!)}><Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}{total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')}</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4"><Input label="用户ID" type="number" {...form.register('userId', { valueAsNumber: true })} /><Input label="平台ID" type="number" {...form.register('platformId', { valueAsNumber: true })} /><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

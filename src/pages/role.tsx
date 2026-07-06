import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Pencil, Search, RefreshCw, MoreHorizontal } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { findRolePage, saveRole, deleteRole, deleteRoles, changeRoleEnabledState } from '@/api/modules/role'
import type { RoleDto, QueryRoleDto, EnabledState } from '@/types'
import { MoreHorizontal } from 'lucide-react'

const formSchema = z.object({ name: z.string().min(1, '请输入角色名称'), sort: z.number().optional(), enabledState: z.string().optional() })
type FormData = z.infer<typeof formSchema>

export default function RoleManagement() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keywords, setKeywords] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<RoleDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const query: QueryRoleDto = { pageNumber: page, pageSize, keywords }
  const { data, isLoading } = useQuery({
    queryKey: ['roles', query],
    queryFn: () => findRolePage(query),
  })

  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const saveMutation = useMutation({
    mutationFn: saveRole,
    onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['roles'] }) },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['roles'] }) },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const batchDeleteMutation = useMutation({
    mutationFn: deleteRoles,
    onSuccess: () => { toast.success(t('common.operationSuccess')); setSelectedIds(new Set()); queryClient.invalidateQueries({ queryKey: ['roles'] }) },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const toggleMutation = useMutation({
    mutationFn: changeRoleEnabledState,
    onSuccess: () => { toast.success(t('common.operationSuccess')); queryClient.invalidateQueries({ queryKey: ['roles'] }) },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const handleEdit = useCallback((item: RoleDto) => {
    setEditing(item); form.reset({ name: item.name || '', sort: item.sort || 0, enabledState: item.enabledState || 'ON' }); setDialogOpen(true)
  }, [form])

  const handleCreate = useCallback(() => { setEditing(null); form.reset({ name: '', sort: 0, enabledState: 'ON' }); setDialogOpen(true) }, [form])
  const handleSubmit = useCallback((d: FormData) => { saveMutation.mutate({ id: editing?.id, ...d }) }, [editing, saveMutation])

  const items = data?.data?.content || []
  const total = data?.data?.totalElements || 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('role.title')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div>
        <Button onClick={handleCreate}><Plus className="h-4 w-4" />{t('common.create')}</Button>
      </div>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><Input placeholder={t('common.keywordSearch')} className="pl-9" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && queryClient.invalidateQueries({ queryKey: ['roles'] })} /></div>
            <Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['roles'] })}><RefreshCw className="h-4 w-4" /></Button>
            {selectedIds.size > 0 && <Button variant="danger" size="sm" onClick={() => batchDeleteMutation.mutate([...selectedIds])}><Trash2 className="h-4 w-4" />{t('common.batchDelete')} ({selectedIds.size})</Button>}
          </div>
          {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState onAction={handleCreate} actionLabel={t('common.create')} /> : (
            <Table>
              <TableHeader><TableRow><TableHead className="w-10"><Switch checked={selectedIds.size === items.length && items.length > 0} onCheckedChange={() => { if (selectedIds.size === items.length) setSelectedIds(new Set()); else setSelectedIds(new Set(items.map((r) => r.id!))) }} /></TableHead><TableHead>{t('role.name')}</TableHead><TableHead>{t('role.sort')}</TableHead><TableHead>{t('common.status')}</TableHead><TableHead className="w-16">{t('common.actions')}</TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><Switch checked={selectedIds.has(item.id!)} onCheckedChange={() => { const next = new Set(selectedIds); next.has(item.id!) ? next.delete(item.id!) : next.add(item.id!); setSelectedIds(next) }} /></TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sort}</TableCell>
                    <TableCell><Badge variant={item.enabledState === 'ON' ? 'success' : 'danger'} dot>{item.enabledState === 'ON' ? t('common.enabled') : t('common.disabled')}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="h-4 w-4 mr-2" />{t('common.edit')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleMutation.mutate({ id: item.id!, enabledState: item.enabledState === 'ON' ? 'OFF' as EnabledState : 'ON' as EnabledState })}><Switch className="h-4 w-4 mr-2" />{item.enabledState === 'ON' ? t('common.disabled') : t('common.enabled')}</DropdownMenuItem>
                          <DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(item.id!)}><Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {total > pageSize && (
            <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>
          )}
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')}</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4"><Input label={t('role.name')} {...form.register('name')} error={form.formState.errors.name?.message} /><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

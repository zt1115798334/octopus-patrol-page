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
import { findPricingPlanPage, savePricingPlan, deletePricingPlan, changePricingPlanEnabledState } from '@/api/modules/pricing-plan'
import { formatDate } from '@/lib/utils'
import type { PricingPlanDto, QueryKeywordsDto, EnabledState, PlanLevel } from '@/types'

const formSchema = z.object({ planName: z.string().min(1, '请输入套餐名称'), planLevel: z.string().optional(), originalPrice: z.number().optional(), discountPrice: z.number().optional(), keywordLimit: z.number().optional(), dailyCommentLimit: z.number().optional(), aiConfigLimit: z.number().optional(), tokenLimit: z.number().optional(), enabledState: z.string().optional() })
type FormData = z.infer<typeof formSchema>

export default function PricingPlanManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [pageSize] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false); const [editing, setEditing] = useState<PricingPlanDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const query: QueryKeywordsDto = { pageNumber: page, pageSize }
  const { data, isLoading } = useQuery({ queryKey: ['pricingPlans', query], queryFn: () => findPricingPlanPage(query) })
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const saveMutation = useMutation({ mutationFn: savePricingPlan, onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['pricingPlans'] }) }, onError: () => {} })
  const deleteMutation = useMutation({ mutationFn: deletePricingPlan, onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['pricingPlans'] }) }, onError: () => {} })
  const toggleMutation = useMutation({ mutationFn: changePricingPlanEnabledState, onSuccess: () => { toast.success(t('common.operationSuccess')); queryClient.invalidateQueries({ queryKey: ['pricingPlans'] }) }, onError: () => {} })

  const handleEdit = useCallback((item: PricingPlanDto) => { setEditing(item); form.reset({ planName: item.planName || '', planLevel: item.planLevel || 'FREE', originalPrice: item.originalPrice || 0, discountPrice: item.discountPrice || 0, keywordLimit: item.keywordLimit || 0, dailyCommentLimit: item.dailyCommentLimit || 0, aiConfigLimit: item.aiConfigLimit || 0, tokenLimit: item.tokenLimit || 0, enabledState: item.enabledState || 'ON' }); setDialogOpen(true) }, [form])
  const handleCreate = useCallback(() => { setEditing(null); form.reset({ planName: '', planLevel: 'FREE', originalPrice: 0, discountPrice: 0, keywordLimit: 0, dailyCommentLimit: 0, aiConfigLimit: 0, tokenLimit: 0, enabledState: 'ON' }); setDialogOpen(true) }, [form])
  const handleSubmit = useCallback((d: FormData) => { saveMutation.mutate({ id: editing?.id, ...d }) }, [editing, saveMutation])

  const items = data?.page?.list || []; const total = data?.page?.total || 0
  const levelLabels: Record<string, string> = { FREE: '免费', MONTHLY: '月付', YEARLY: '年付' }

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('pricingPlan.title')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div><Button onClick={handleCreate}><Plus className="h-4 w-4" />{t('common.create')}</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['pricingPlans'] })}><RefreshCw className="h-4 w-4 mr-2" />{t('common.refresh')}</Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState onAction={handleCreate} actionLabel={t('common.create')} /> : (
          <Table><TableHeader><TableRow><TableHead>{t('pricingPlan.planName')}</TableHead><TableHead>{t('pricingPlan.planLevel')}</TableHead><TableHead>{t('pricingPlan.originalPrice')}</TableHead><TableHead>{t('pricingPlan.discountPrice')}</TableHead><TableHead>{t('pricingPlan.keywordLimit')}</TableHead><TableHead>{t('common.status')}</TableHead><TableHead className="w-16">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell className="font-medium">{item.planName}</TableCell><TableCell><Badge variant={item.planLevel === 'FREE' ? 'default' : item.planLevel === 'MONTHLY' ? 'info' : 'warning'}>{levelLabels[item.planLevel || ''] || item.planLevel}</Badge></TableCell><TableCell>¥{item.originalPrice || 0}</TableCell><TableCell>¥{item.discountPrice || 0}</TableCell><TableCell>{item.keywordLimit || 0}</TableCell><TableCell><Badge variant={item.enabledState === 'ON' ? 'success' : 'danger'} dot>{item.enabledState === 'ON' ? t('common.enabled') : t('common.disabled')}</Badge></TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="h-4 w-4 mr-2" />{t('common.edit')}</DropdownMenuItem><DropdownMenuItem onClick={() => toggleMutation.mutate({ id: item.id!, enabledState: item.enabledState === 'ON' ? 'OFF' as EnabledState : 'ON' as EnabledState })}>{item.enabledState === 'ON' ? t('common.disabled') : t('common.enabled')}</DropdownMenuItem><DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(item.id!)}><Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}{total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')}</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4"><Input label={t('pricingPlan.planName')} {...form.register('planName')} error={form.formState.errors.planName?.message} /><div className="grid grid-cols-2 gap-3"><Input label={t('pricingPlan.originalPrice')} type="number" {...form.register('originalPrice', { valueAsNumber: true })} /><Input label={t('pricingPlan.discountPrice')} type="number" {...form.register('discountPrice', { valueAsNumber: true })} /></div><div className="grid grid-cols-2 gap-3"><Input label={t('pricingPlan.keywordLimit')} type="number" {...form.register('keywordLimit', { valueAsNumber: true })} /><Input label={t('pricingPlan.commentLimit')} type="number" {...form.register('dailyCommentLimit', { valueAsNumber: true })} /></div><div className="grid grid-cols-2 gap-3"><Input label={t('pricingPlan.aiConfigLimit')} type="number" {...form.register('aiConfigLimit', { valueAsNumber: true })} /><Input label={t('pricingPlan.tokenLimit')} type="number" {...form.register('tokenLimit', { valueAsNumber: true })} /></div><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

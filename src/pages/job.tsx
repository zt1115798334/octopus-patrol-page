import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, RefreshCw, Pause, Play, MoreHorizontal, Clock } from 'lucide-react'
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
import { findAllJobs, addJob, pauseJob, resumeJob, deleteJob } from '@/api/modules/job'

const formSchema = z.object({ jobName: z.string().min(1, '请输入任务名称'), jobGroup: z.string().min(1, '请输入分组'), jobClassName: z.string().min(1, '请输入执行类'), cronExpression: z.string().min(1, '请输入Cron表达式'), description: z.string().optional() })
type FormData = z.infer<typeof formSchema>

export default function JobManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false); const [deleteTarget, setDeleteTarget] = useState<{ name: string; group: string } | null>(null)

  const { data, isLoading } = useQuery({ queryKey: ['jobs'], queryFn: findAllJobs })
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const addMutation = useMutation({ mutationFn: addJob, onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['jobs'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const pauseMutation = useMutation({ mutationFn: pauseJob, onSuccess: () => { toast.success(t('common.operationSuccess')); queryClient.invalidateQueries({ queryKey: ['jobs'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const resumeMutation = useMutation({ mutationFn: resumeJob, onSuccess: () => { toast.success(t('common.operationSuccess')); queryClient.invalidateQueries({ queryKey: ['jobs'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const deleteMutation = useMutation({ mutationFn: deleteJob, onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['jobs'] }) }, onError: () => toast.error(t('common.operationFailed')) })

  const handleSubmit = useCallback((d: FormData) => { addMutation.mutate(d) }, [addMutation])

  const jobs = (data?.data || []) as Array<Record<string, unknown>>

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('schedule.title')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total: jobs.length })}</p></div><Button onClick={() => { form.reset({ jobName: '', jobGroup: 'DEFAULT', jobClassName: '', cronExpression: '', description: '' }); setDialogOpen(true) }}><Plus className="h-4 w-4" />{t('common.create')}</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['jobs'] })}><RefreshCw className="h-4 w-4 mr-2" />{t('common.refresh')}</Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : jobs.length === 0 ? <EmptyState onAction={() => setDialogOpen(true)} actionLabel={t('common.create')} /> : (
          <Table><TableHeader><TableRow><TableHead>{t('schedule.jobName')}</TableHead><TableHead>{t('schedule.jobGroup')}</TableHead><TableHead>{t('schedule.jobClass')}</TableHead><TableHead>{t('schedule.cronExpression')}</TableHead><TableHead>{t('schedule.description')}</TableHead><TableHead className="w-24">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{jobs.map((job, i) => (
              <TableRow key={i}><TableCell className="font-medium">{String(job.jobName || '-')}</TableCell><TableCell><Badge variant="info">{String(job.jobGroup || '-')}</Badge></TableCell><TableCell className="font-mono text-xs">{String(job.jobClassName || '-')}</TableCell><TableCell className="font-mono text-xs">{String(job.cronExpression || '-')}</TableCell><TableCell className="text-sm text-neutral-500">{String(job.description || '-')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => pauseMutation.mutate({ jobName: String(job.jobName || ''), jobGroup: String(job.jobGroup || '') })}><Pause className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => resumeMutation.mutate({ jobName: String(job.jobName || ''), jobGroup: String(job.jobGroup || '') })}><Play className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-danger-500" onClick={() => setDeleteTarget({ name: String(job.jobName || ''), group: String(job.jobGroup || '') })}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{t('common.create')}</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4"><Input label={t('schedule.jobName')} {...form.register('jobName')} error={form.formState.errors.jobName?.message} /><Input label={t('schedule.jobGroup')} {...form.register('jobGroup')} error={form.formState.errors.jobGroup?.message} /><Input label={t('schedule.jobClass')} {...form.register('jobClassName')} error={form.formState.errors.jobClassName?.message} /><Input label={t('schedule.cronExpression')} {...form.register('cronExpression')} error={form.formState.errors.cronExpression?.message} placeholder="0 0/5 * * * ?" /><Input label={t('schedule.description')} {...form.register('description')} /><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={addMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

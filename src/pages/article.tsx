import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Pencil, Search, RefreshCw, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { findArticlePage, saveArticle, deleteArticle, crawlArticles } from '@/api/modules/article'
import { formatDate } from '@/lib/utils'
import type { ArticleDto, QueryArticleDto } from '@/types'

const formSchema = z.object({ title: z.string().min(1, '请输入标题'), content: z.string().optional(), url: z.string().optional(), publishTime: z.string().optional() })
type FormData = z.infer<typeof formSchema>

export default function ArticleManagement() {
  const { t } = useTranslation(); const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [pageSize] = useState(10); const [keywords, setKeywords] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false); const [editing, setEditing] = useState<ArticleDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const query: QueryArticleDto = { pageNumber: page, pageSize, keywords }
  const { data, isLoading } = useQuery({ queryKey: ['articles', query], queryFn: () => findArticlePage(query) })
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const saveMutation = useMutation({ mutationFn: saveArticle, onSuccess: () => { toast.success(t('common.operationSuccess')); setDialogOpen(false); queryClient.invalidateQueries({ queryKey: ['articles'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const deleteMutation = useMutation({ mutationFn: deleteArticle, onSuccess: () => { toast.success(t('common.operationSuccess')); setDeleteTarget(null); queryClient.invalidateQueries({ queryKey: ['articles'] }) }, onError: () => toast.error(t('common.operationFailed')) })
  const crawlMutation = useMutation({ mutationFn: crawlArticles, onSuccess: () => { toast.success('爬取任务已触发'); queryClient.invalidateQueries({ queryKey: ['articles'] }) }, onError: () => toast.error(t('common.operationFailed')) })

  const handleEdit = useCallback((item: ArticleDto) => { setEditing(item); form.reset({ title: item.title || '', content: item.content || '', url: item.url || '', publishTime: item.publishTime || '' }); setDialogOpen(true) }, [form])
  const handleCreate = useCallback(() => { setEditing(null); form.reset({ title: '', content: '', url: '', publishTime: '' }); setDialogOpen(true) }, [form])
  const handleSubmit = useCallback((d: FormData) => { saveMutation.mutate({ id: editing?.id, ...d }) }, [editing, saveMutation])

  const items = data?.page?.list || []; const total = data?.page?.total || 0

  return (
    <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('nav.article')}</h1><p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => crawlMutation.mutate({ pageNumber: 1, pageSize: 100 })} loading={crawlMutation.isPending}>爬取文章</Button><Button onClick={handleCreate}><Plus className="h-4 w-4" />{t('common.create')}</Button></div></div>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3 mb-4"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><Input placeholder={t('common.keywordSearch')} className="pl-9" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && queryClient.invalidateQueries({ queryKey: ['articles'] })} /></div><Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['articles'] })}><RefreshCw className="h-4 w-4" /></Button></div>
        {isLoading ? <SkeletonTable rows={5} /> : items.length === 0 ? <EmptyState onAction={handleCreate} actionLabel={t('common.create')} /> : (
          <Table><TableHeader><TableRow><TableHead>标题</TableHead><TableHead>URL</TableHead><TableHead>发布时间</TableHead><TableHead>创建时间</TableHead><TableHead className="w-16">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((item) => (
              <TableRow key={item.id}><TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell><TableCell className="text-xs text-neutral-500 max-w-[200px] truncate"><a href={item.url || '#'} target="_blank" className="hover:text-primary-500">{item.url}</a></TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.publishTime, 'yyyy-MM-dd')}</TableCell><TableCell className="text-sm text-neutral-500">{formatDate(item.createdTime)}</TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="h-4 w-4 mr-2" />{t('common.edit')}</DropdownMenuItem><DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(item.id!)}><Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>
            ))}</TableBody></Table>
        )}{total > pageSize && <div className="flex items-center justify-between pt-4"><p className="text-sm text-neutral-500">{t('common.total', { total })}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{t('common.back')}</Button><Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>{t('common.more')}</Button></div></div>}
      </CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')}</DialogTitle></DialogHeader><form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4"><Input label="标题" {...form.register('title')} error={form.formState.errors.title?.message} /><Input label="URL" {...form.register('url')} /><Input label="内容" {...form.register('content')} /><Input label="发布时间" type="datetime-local" {...form.register('publishTime')} /><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle><AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel><AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>{t('common.confirm')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

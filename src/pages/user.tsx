import { useState, useCallback, type ChangeEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Pencil, Search, RefreshCw, MoreHorizontal, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonTable } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { findUserPage, saveUser, deleteUser, deleteUsers, changeUserEnabledState } from '@/api/modules/user'
import { uploadFile } from '@/api/modules/file'
import { formatDate } from '@/lib/utils'
import type { UserDto, QueryUserDto, EnabledState } from '@/types'

const userFormSchema = z.object({
  account: z.string().min(1, '请输入账号'),
  username: z.string().min(1, '请输入用户名'),
  phone: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  enabledState: z.string().optional(),
  avatarId: z.number().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

type UserFormData = z.infer<typeof userFormSchema>

export default function UserManagement() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keywords, setKeywords] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const query: QueryUserDto = { pageNumber: page, pageSize, keywords }

  const { data, isLoading } = useQuery({
    queryKey: ['users', query],
    queryFn: () => findUserPage(query),
  })

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  })

  const saveMutation = useMutation({
    mutationFn: saveUser,
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      setDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const batchDeleteMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const toggleEnabledMutation = useMutation({
    mutationFn: changeUserEnabledState,
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const handleEdit = useCallback((user: UserDto) => {
    setEditingUser(user)
    form.reset({
      account: user.account || '',
      username: user.username || '',
      phone: user.phone || '',
      enabledState: user.enabledState || 'ON',
      avatarId: user.avatarId,
    })
    setAvatarPreview(null)
    setDialogOpen(true)
  }, [form])

  const handleCreate = useCallback(() => {
    setEditingUser(null)
    form.reset({ account: '', username: '', phone: '', password: '', enabledState: 'ON' })
    setDialogOpen(true)
  }, [form])

  const handleSubmit = useCallback((formData: UserFormData) => {
    const payload: UserDto = {
      id: editingUser?.id,
      account: formData.account,
      username: formData.username,
      phone: formData.phone,
      password: formData.password,
      enabledState: formData.enabledState,
      avatarId: formData.avatarId,
    }
    saveMutation.mutate(payload)
  }, [editingUser, saveMutation])

  const handleAvatarChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarUploading(true)
    try {
      const res = await uploadFile(file)
      const info = res.obj ?? (res as unknown as { data?: { id?: number } }).data
      if (info?.id != null) {
        form.setValue('avatarId', info.id)
        toast.success(t('common.operationSuccess'))
      } else {
        toast.error(t('common.operationFailed'))
      }
    } catch {
      toast.error(t('common.operationFailed'))
    } finally {
      setAvatarUploading(false)
    }
  }, [form, t])

  const users = data?.page?.list || []
  const total = data?.page?.total || 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('user.title')}</h1>
          <p className="text-sm text-neutral-500 mt-1">{t('common.total', { total })}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          {t('common.create')}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder={t('common.keywordSearch')}
                className="pl-9"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && queryClient.invalidateQueries({ queryKey: ['users'] })}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {selectedIds.size > 0 && (
              <Button variant="danger" size="sm" onClick={() => batchDeleteMutation.mutate([...selectedIds])}>
                <Trash2 className="h-4 w-4" />
                {t('common.batchDelete')} ({selectedIds.size})
              </Button>
            )}
          </div>

          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : users.length === 0 ? (
            <EmptyState onAction={handleCreate} actionLabel={t('common.create')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Switch
                      checked={selectedIds.size === users.length && users.length > 0}
                      onCheckedChange={() => {
                        if (selectedIds.size === users.length) setSelectedIds(new Set())
                        else setSelectedIds(new Set(users.map((u) => u.id!)))
                      }}
                    />
                  </TableHead>
                  <TableHead>{t('user.account')}</TableHead>
                  <TableHead>{t('user.username')}</TableHead>
                  <TableHead>{t('user.phone')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('user.createdTime')}</TableHead>
                  <TableHead className="w-16">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Switch
                        checked={selectedIds.has(user.id!)}
                        onCheckedChange={() => {
                          const next = new Set(selectedIds)
                          next.has(user.id!) ? next.delete(user.id!) : next.add(user.id!)
                          setSelectedIds(next)
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.account}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.enabledState === 'ON' ? 'success' : 'danger'} dot>
                        {user.enabledState === 'ON' ? t('common.enabled') : t('common.disabled')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-500 text-sm">{formatDate(user.createdTime)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="h-4 w-4 mr-2" />{t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleEnabledMutation.mutate({
                            id: user.id!,
                            enabledState: user.enabledState === 'ON' ? 'OFF' as EnabledState : 'ON' as EnabledState,
                          })}>
                            <Shield className="h-4 w-4 mr-2" />
                            {user.enabledState === 'ON' ? t('common.disabled') : t('common.enabled')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-danger-500" onClick={() => setDeleteTarget(user.id!)}>
                            <Trash2 className="h-4 w-4 mr-2" />{t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {total > pageSize && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-neutral-500">{t('common.total', { total })}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  {t('common.back')}
                </Button>
                <Button variant="outline" size="sm" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>
                  {t('common.more')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? t('common.edit') : t('common.create')}</DialogTitle>
            <DialogDescription>{t('user.title')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Input label={t('user.account')} {...form.register('account')} error={form.formState.errors.account?.message} />
            <Input label={t('user.username')} {...form.register('username')} error={form.formState.errors.username?.message} />
            <Input label={t('user.phone')} {...form.register('phone')} />
            {!editingUser && (
              <>
                <Input label={t('auth.password')} type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
                <Input label={t('user.confirmPassword')} type="password" {...form.register('confirmPassword')} error={form.formState.errors.confirmPassword?.message} />
              </>
            )}
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-700">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('user.enabledState')}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">
                  {form.watch('enabledState') === 'ON' ? t('common.enabled') : t('common.disabled')}
                </span>
                <Switch
                  checked={form.watch('enabledState') === 'ON'}
                  onCheckedChange={(checked) => form.setValue('enabledState', checked ? 'ON' : 'OFF')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('user.uploadAvatar')}</label>
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="avatar" />
                  ) : (
                    <AvatarFallback>{(form.watch('username') || '?').charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <Input type="file" accept="image/*" onChange={handleAvatarChange} wrapperClassName="flex-1" />
              </div>
              {avatarUploading && <p className="text-xs text-neutral-500">{t('common.loading')}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
              <Button type="submit" loading={saveMutation.isPending}>{t('common.save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.confirmDeleteDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-danger-500 hover:bg-danger-600" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

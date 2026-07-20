import { useState, useCallback, type ChangeEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Key, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SkeletonCard } from '@/components/ui/skeleton'
import { modifyCurrentAvatarId, findCurrentUser } from '@/api/modules/personal-center'
import { modifyUserPassword } from '@/api/modules/user'
import { uploadFile } from '@/api/modules/file'
import { useShowFileUrl } from '@/hooks'
import { useAuthStore } from '@/stores'
import { toast } from 'sonner'

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, '密码至少6位'),
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

export default function Settings() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { userId } = useAuthStore()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  })

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: findCurrentUser,
  })

  const userInfo = currentUser?.obj

  const avatarMutation = useMutation({
    mutationFn: (avatarId: number) => modifyCurrentAvatarId(avatarId),
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const passwordMutation = useMutation({
    mutationFn: (newPassword: string) =>
      modifyUserPassword({ id: userId!, newPassword }),
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      passwordForm.reset()
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const handleAvatarSelect = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setAvatarPreview(URL.createObjectURL(file))
      setAvatarUploading(true)
      try {
        const res = await uploadFile(file)
        const fileId = res.obj?.id
        if (fileId != null) {
          await avatarMutation.mutateAsync(fileId)
        } else {
          toast.error(t('common.operationFailed'))
        }
      } catch {
        toast.error(t('common.operationFailed'))
      } finally {
        setAvatarUploading(false)
      }
    },
    [avatarMutation, t],
  )

  const handlePassword = useCallback(
    (d: z.infer<typeof passwordSchema>) => {
      passwordMutation.mutate(d.newPassword)
    },
    [passwordMutation],
  )

  const avatarUrl = useShowFileUrl(userInfo?.avatarId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('setting.title')}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {t('setting.description')}
        </p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              {t('user.modifyAvatar')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <SkeletonCard />
            ) : (
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20">
                  {avatarPreview || avatarUrl ? (
                    <AvatarImage
                      src={avatarPreview || avatarUrl || ''}
                      alt="avatar"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {userInfo?.username?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500">
                    {t('user.uploadAvatar')}
                  </p>
                  <div className="relative inline-block">
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleAvatarSelect}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      loading={avatarUploading}
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      {t('user.uploadAvatar')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Key className="h-4 w-4" />
              {t('user.modifyPassword')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(handlePassword)}
              className="space-y-4"
            >
              <Input
                label={t('user.newPassword')}
                type="password"
                {...passwordForm.register('newPassword')}
                error={passwordForm.formState.errors.newPassword?.message}
              />
              <Input
                label={t('user.confirmPassword')}
                type="password"
                {...passwordForm.register('confirmPassword')}
                error={
                  passwordForm.formState.errors.confirmPassword?.message
                }
              />
              <Button type="submit" loading={passwordMutation.isPending}>
                {t('common.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

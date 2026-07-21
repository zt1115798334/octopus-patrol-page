import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Shield, Settings, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/skeleton'
import { getConfigInfo, modifyConfigInfo, findCurrentUser } from '@/api/modules/personal-center'
import { modifyUserPassword } from '@/api/modules/user'
import { useShowFileUrl } from '@/hooks'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores'
import { toast } from 'sonner'
import type { ConfigurationInformationDto } from '@/types'

const passwordSchema = z.object({ newPassword: z.string().min(6, '密码至少6位') })
const configSchema = z.object({ accessExpiration: z.number().optional(), refreshExpiration: z.number().optional() })

export default function PersonalCenter() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { userId } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'config'>('info')

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) })
  const configForm = useForm<z.infer<typeof configSchema>>({ resolver: zodResolver(configSchema) })

  const { data: configData, isLoading: configLoading } = useQuery({
    queryKey: ['jwtConfig'],
    queryFn: getConfigInfo,
  })

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: findCurrentUser,
  })

  const userInfo = currentUser?.obj
  const avatarUrl = useShowFileUrl(userInfo?.avatarId)

  const passwordMutation = useMutation({
    mutationFn: modifyUserPassword,
    onSuccess: () => { toast.success(t('common.operationSuccess')); passwordForm.reset() },
    onError: () => {},
  })

  const configMutation = useMutation({
    mutationFn: modifyConfigInfo,
    onSuccess: () => toast.success(t('common.operationSuccess')),
    onError: () => {},
  })

  const handlePassword = useCallback((d: z.infer<typeof passwordSchema>) => {
    if (!userId) return
    passwordMutation.mutate({ id: userId, newPassword: d.newPassword })
  }, [userId, passwordMutation])

  const handleConfig = useCallback((d: z.infer<typeof configSchema>) => {
    configMutation.mutate(d as ConfigurationInformationDto)
  }, [configMutation])

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('nav.personalCenter')}</h1></div>
      <div className="flex gap-4">
        <div className="w-48 space-y-1">
          {[{ id: 'info', label: '个人信息', icon: <User className="h-4 w-4" /> }, { id: 'password', label: '修改密码', icon: <Key className="h-4 w-4" /> }, { id: 'config', label: 'JWT配置', icon: <Settings className="h-4 w-4" /> }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>{tab.icon}{tab.label}</button>
          ))}
        </div>
        <div className="flex-1 max-w-lg">
          {activeTab === 'info' && (
            <Card><CardContent className="pt-6">
              {userLoading ? <SkeletonCard /> : (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={userInfo?.username || ''} />}
                    <AvatarFallback className="text-xl">
                      {userInfo?.username?.charAt(0)?.toUpperCase() || <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{userInfo?.username || userInfo?.account || '-'}</h3>
                    <p className="text-sm text-neutral-500">{userInfo?.account || '-'}</p>
                    {userInfo?.phone && <p className="text-xs text-neutral-400 mt-1">{userInfo.phone}</p>}
                    {userInfo?.roles && userInfo.roles.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {userInfo.roles.map((role) => (
                          <span key={role.id} className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
                            {role.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent></Card>
          )}
          {activeTab === 'password' && (
            <Card><CardContent className="pt-6"><form onSubmit={passwordForm.handleSubmit(handlePassword)} className="space-y-4"><Input label={t('user.newPassword')} type="password" {...passwordForm.register('newPassword')} error={passwordForm.formState.errors.newPassword?.message} /><Button type="submit" loading={passwordMutation.isPending}>{t('common.save')}</Button></form></CardContent></Card>
          )}
          {activeTab === 'config' && (
            <Card><CardContent className="pt-6">
              {configLoading ? <SkeletonCard /> : <form onSubmit={configForm.handleSubmit(handleConfig)} className="space-y-4"><Input label="Access Token 过期时长" type="number" {...configForm.register('accessExpiration', { valueAsNumber: true })} defaultValue={configData?.obj?.accessExpiration} /><Input label="Refresh Token 过期时长" type="number" {...configForm.register('refreshExpiration', { valueAsNumber: true })} defaultValue={configData?.obj?.refreshExpiration} /><Button type="submit" loading={configMutation.isPending}>{t('common.save')}</Button></form>}
            </CardContent></Card>
          )}
        </div>
      </div>
    </div>
  )
}

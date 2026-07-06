import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Bot, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login as loginApi } from '@/api/modules/auth'
import { useAuthStore } from '@/stores'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'

const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const authLogin = useAuthStore((s) => s.login)
  const { t, i18n } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setLoading(true)
      try {
        const res = await loginApi(data)
        if (res.meta.success) {
          const token = res.data
          authLogin(token, token)
          toast.success(t('auth.loginSuccess'))
          const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
          navigate(from, { replace: true })
        }
      } catch {
        toast.error(t('auth.loginFailed'))
      } finally {
        setLoading(false)
      }
    },
    [authLogin, navigate, location, t],
  )

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950">
      {/* Left - Brand */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            Octopus Patrol
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            智能巡检平台 · 全方位监控 · 智能化管理
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { value: '99.9%', label: '可用性' },
              { value: '<50ms', label: '响应速度' },
              { value: '24/7', label: '全天监控' },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur">
                <div className="text-xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{t('auth.login')}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              请输入您的账号信息登录系统
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.username')}
              placeholder={t('auth.pleaseInputUsername')}
              {...register('username')}
              error={errors.username?.message}
            />
            <Input
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.pleaseInputPassword')}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register('password')}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <Switch checked={rememberMe} onCheckedChange={setRememberMe} />
                {t('auth.rememberMe')}
              </label>
              <button
                type="button"
                onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                {i18n.language === 'zh' ? 'English' : '中文'}
              </button>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {t('auth.login')}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

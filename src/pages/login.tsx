import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Bot, Sparkles, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login as loginApi } from '@/api/modules/auth'
import { useAuthStore, useThemeStore, useSettingStore } from '@/stores'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

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
  const { mode, setMode } = useThemeStore()
  const { themeStyle, setThemeStyle } = useSettingStore()

  // Force dark mode only for the login page visual effect
  useEffect(() => {
    const root = document.documentElement
    const wasDark = root.classList.contains('dark')
    root.classList.add('dark')
    return () => {
      if (!wasDark) {
        root.classList.remove('dark')
      }
    }
  }, [])

  const {
    control,
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
        console.log('[Login] res:', res)
        if (res.meta.success) {
          const token = res.data
          authLogin(token, token)
          toast.success(t('auth.loginSuccess'))
          const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
          navigate(from, { replace: true })
        }
    } catch (e) {
      console.error('[Login] error:', e)
      toast.error(t('auth.loginFailed'))
      } finally {
        setLoading(false)
      }
    },
    [authLogin, navigate, location, t],
  )

  const stats = [
    { value: '99.9%', label: t('auth.statsAvailability') },
    { value: '<50ms', label: t('auth.statsLatency') },
    { value: '24/7', label: t('auth.statsMonitoring') },
  ]

  return (
    <TooltipProvider delayDuration={300}>
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background flowing light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Beam 1 - wide sweeping light */}
        <div
          className="absolute top-0 left-1/2 w-[800px] h-[600px] animate-light-flow-1 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, rgba(6,182,212,0.15) 30%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Beam 2 - angled sweep */}
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[500px] animate-light-flow-2 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6,182,212,0.35) 0%, rgba(124,58,237,0.1) 35%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Beam 3 - smaller fast sweep */}
        <div
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] animate-light-flow-3 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(167,139,250,0.3) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full animate-float-orb-1"
          style={{
            background:
              'radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-[10%] right-[15%] w-80 h-80 rounded-full animate-float-orb-2"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute top-[40%] right-[5%] w-48 h-48 rounded-full animate-float-orb-3"
          style={{
            background:
              'radial-gradient(circle, rgba(167,139,250,0.2) 0%, rgba(167,139,250,0.03) 40%, transparent 70%)',
            filter: 'blur(35px)',
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main glass card with border glow */}
      <div className="relative w-full max-w-[420px] mx-4 z-10">
        {/* Animated border glow ring */}
        <div
          className="absolute -inset-[1px] rounded-2xl animate-card-glow opacity-70 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.5), rgba(167,139,250,0.5), rgba(124,58,237,0.5))',
            backgroundSize: '300% 300%',
            filter: 'blur(8px)',
          }}
        />

        {/* Card content */}
        <div className="relative rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          {/* Subtle inner glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-30 animate-pulse-glow pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%)',
            }}
          />

          <div className="relative">
            {/* Brand header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse-glow" />
                <Bot className="h-7 w-7 text-white relative z-10" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                Octopus Patrol
              </h1>
              <p className="text-sm text-neutral-400">{t('auth.platformDesc')}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center py-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <span className="text-lg font-bold gradient-text">{stat.value}</span>
                  <span className="text-xs text-neutral-500 mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-6" />

            {/* Login form */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">{t('auth.login')}</h2>
                <p className="text-sm text-neutral-500 mt-1">{t('auth.loginSubtitle')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label={t('auth.username')}
                      placeholder={t('auth.pleaseInputUsername')}
                      className="bg-neutral-800/80 border-neutral-700/80 text-neutral-50 placeholder:text-neutral-500"
                      {...field}
                      error={errors.username?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label={t('auth.password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.pleaseInputPassword')}
                      className="bg-neutral-800/80 border-neutral-700/80 text-neutral-50 placeholder:text-neutral-500"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer text-neutral-500 hover:text-neutral-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      {...field}
                      error={errors.password?.message}
                    />
                  )}
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                    <Switch checked={rememberMe} onCheckedChange={setRememberMe} />
                    {t('auth.rememberMe')}
                  </label>
                  <button
                    type="button"
                    onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {i18n.language === 'zh' ? 'English' : '中文'}
                  </button>
                </div>

                {/* Theme & Style toggles */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setThemeStyle(themeStyle === 'anime' ? 'default' : 'anime')}
                        className={cn(
                          'p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200',
                          themeStyle === 'anime' && 'text-primary-400 bg-white/10',
                        )}
                      >
                        <Sparkles className={cn('h-4 w-4 transition-all duration-300', themeStyle === 'anime' && 'scale-110')} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{t('theme.anime')}</TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem onClick={() => setMode('light')}>
                        <Sun className="mr-2 h-4 w-4" />
                        {t('theme.light')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMode('dark')}>
                        <Moon className="mr-2 h-4 w-4" />
                        {t('theme.dark')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMode('system')}>
                        <Monitor className="mr-2 h-4 w-4" />
                        {t('theme.system')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button type="submit" className="w-full" loading={loading} size="lg">
                  {t('auth.login')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <p className="absolute bottom-6 text-xs text-neutral-600 z-10">
        &copy; {new Date().getFullYear()} Octopus Patrol. All rights reserved.
      </p>
    </div>
    </TooltipProvider>
  )
}

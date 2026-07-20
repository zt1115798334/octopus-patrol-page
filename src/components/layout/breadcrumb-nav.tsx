import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const pathLabelMap: Record<string, string> = {
  '/': 'dashboard',
  '/user': 'user',
  '/role': 'role',
  '/menu': 'menu',
  '/permission': 'permission',
  '/log': 'log',
  '/ai-config': 'aiConfig',
  '/article': 'article',
  '/comment-keyword': 'commentKeyword',
  '/platform': 'platform',
  '/platform-account': 'platformAccount',
  '/platform-permission': 'platformPermission',
  '/job': 'job',
  '/pricing-plan': 'pricingPlan',
  '/pricing-history': 'pricingHistory',
  '/amqp': 'amqp',
  '/external': 'external',
  '/personal-center': 'personalCenter',
  '/xhs-search': 'xhsSearch',
}

export function BreadcrumbNav() {
  const location = useLocation()
  const { t } = useTranslation()
  const paths = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = [
    { path: '/', label: t('nav.dashboard') },
    ...paths.map((_, index) => {
      const path = '/' + paths.slice(0, index + 1).join('/')
      const navKey = pathLabelMap[path]
      return {
        path,
        label: navKey ? t(`nav.${navKey}`) : paths[index],
      }
    }),
  ]

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 px-1">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-neutral-900 dark:text-neutral-50">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors"
            >
              {index === 0 ? <Home className="h-3.5 w-3.5" /> : crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

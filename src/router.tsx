import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { AuthGuard } from '@/components/auth/auth-guard'

const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const UserManagement = lazy(() => import('@/pages/user'))
const RoleManagement = lazy(() => import('@/pages/role'))
const MenuManagement = lazy(() => import('@/pages/menu'))
const PermissionManagement = lazy(() => import('@/pages/permission'))
const TenantManagement = lazy(() => import('@/pages/tenant'))
const LogManagement = lazy(() => import('@/pages/log'))
const AiConfig = lazy(() => import('@/pages/ai-config'))
const ArticleManagement = lazy(() => import('@/pages/article'))
const CommentKeyword = lazy(() => import('@/pages/comment-keyword'))
const PlatformManagement = lazy(() => import('@/pages/platform'))
const PlatformAccount = lazy(() => import('@/pages/platform-account'))
const PlatformPermission = lazy(() => import('@/pages/platform-permission'))
const JobManagement = lazy(() => import('@/pages/job'))
const PricingPlan = lazy(() => import('@/pages/pricing-plan'))
const PricingHistory = lazy(() => import('@/pages/pricing-history'))
const AmqpManagement = lazy(() => import('@/pages/amqp'))
const ExternalService = lazy(() => import('@/pages/external'))
const PersonalCenter = lazy(() => import('@/pages/personal-center'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'user', element: <UserManagement /> },
      { path: 'role', element: <RoleManagement /> },
      { path: 'menu', element: <MenuManagement /> },
      { path: 'permission', element: <PermissionManagement /> },
      { path: 'tenant', element: <TenantManagement /> },
      { path: 'log', element: <LogManagement /> },
      { path: 'ai-config', element: <AiConfig /> },
      { path: 'article', element: <ArticleManagement /> },
      { path: 'comment-keyword', element: <CommentKeyword /> },
      { path: 'platform', element: <PlatformManagement /> },
      { path: 'platform-account', element: <PlatformAccount /> },
      { path: 'platform-permission', element: <PlatformPermission /> },
      { path: 'job', element: <JobManagement /> },
      { path: 'pricing-plan', element: <PricingPlan /> },
      { path: 'pricing-history', element: <PricingHistory /> },
      { path: 'amqp', element: <AmqpManagement /> },
      { path: 'external', element: <ExternalService /> },
      { path: 'personal-center', element: <PersonalCenter /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

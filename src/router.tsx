import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { AuthGuard } from '@/components/auth/auth-guard'

const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const UserManagement = lazy(() => import('@/pages/user'))
const MenuManagement = lazy(() => import('@/pages/menu'))
const LogManagement = lazy(() => import('@/pages/log'))
const PricingPlan = lazy(() => import('@/pages/pricing-plan'))
const PlatformManagement = lazy(() => import('@/pages/platform'))
const PlatformAccount = lazy(() => import('@/pages/platform-account'))
const RunPlan = lazy(() => import('@/pages/run-plan'))
const AiConfig = lazy(() => import('@/pages/ai-config'))
const AiUsage = lazy(() => import('@/pages/ai-usage'))

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
      { path: 'menu', element: <MenuManagement /> },
      { path: 'log', element: <LogManagement /> },
      { path: 'pricing-plan', element: <PricingPlan /> },
      { path: 'platform', element: <PlatformManagement /> },
      { path: 'platform-account', element: <PlatformAccount /> },
      { path: 'run-plan', element: <RunPlan /> },
      { path: 'ai-config', element: <AiConfig /> },
      { path: 'ai-usage', element: <AiUsage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

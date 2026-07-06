import { type ReactNode } from 'react'
import { usePermissionStore } from '@/stores'

interface PermissionGateProps {
  permission?: string
  button?: string
  children: ReactNode
  fallback?: ReactNode | null
}

export function PermissionGate({
  permission,
  button,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasButtonPermission } = usePermissionStore()

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  if (button && !hasButtonPermission(button)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export function hasPermissionGate(permission?: string, button?: string) {
  // This is a utility that returns the check as a function
  // for use in non-component contexts
  return { permission, button }
}

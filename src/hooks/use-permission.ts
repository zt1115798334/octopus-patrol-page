import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermissionStore } from '@/stores'

export function usePermission() {
  const {
    permissions,
    menus,
    buttonPermissions,
    hasPermission,
    hasButtonPermission,
    setPermissions,
    setMenus,
    setButtonPermissions,
    reset,
  } = usePermissionStore()
  const navigate = useNavigate()

  const checkAndRedirect = useCallback(
    (permission: string, redirectTo = '/') => {
      if (!hasPermission(permission)) {
        navigate(redirectTo)
        return false
      }
      return true
    },
    [hasPermission, navigate],
  )

  const canAccessMenu = useCallback(
    (menuPath: string) => {
      const menu = menus.find((m) => m.path === menuPath)
      if (!menu) return true // If no permission config, allow access
      return hasPermission(menu.permission || `menu:${menu.id}`)
    },
    [menus, hasPermission],
  )

  return {
    permissions,
    menus,
    buttonPermissions,
    hasPermission,
    hasButtonPermission,
    canAccessMenu,
    checkAndRedirect,
    setPermissions,
    setMenus,
    setButtonPermissions,
    reset,
  }
}

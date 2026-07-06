import { create } from 'zustand'
import type { MenuDto } from '@/types'

export interface PermissionState {
  permissions: string[]
  menus: MenuDto[]
  buttonPermissions: string[]
  setPermissions: (permissions: string[]) => void
  setMenus: (menus: MenuDto[]) => void
  setButtonPermissions: (permissions: string[]) => void
  hasPermission: (key: string) => boolean
  hasButtonPermission: (key: string) => boolean
  reset: () => void
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  permissions: [],
  menus: [],
  buttonPermissions: [],

  setPermissions: (permissions) => set({ permissions }),
  setMenus: (menus) => set({ menus }),
  setButtonPermissions: (permissions) => set({ buttonPermissions: permissions }),

  hasPermission: (key: string) => {
    const { permissions } = get()
    if (permissions.includes('*:*:*')) return true
    return permissions.includes(key)
  },

  hasButtonPermission: (key: string) => {
    const { buttonPermissions } = get()
    if (buttonPermissions.includes('*:*:*')) return true
    return buttonPermissions.includes(key)
  },

  reset: () => set({ permissions: [], menus: [], buttonPermissions: [] }),
}))

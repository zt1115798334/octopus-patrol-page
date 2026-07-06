import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ColorMode = 'default' | 'emerald' | 'orange' | 'rose' | 'sky'
export type TableDensity = 'compact' | 'normal' | 'comfortable'

export interface SettingState {
  colorMode: ColorMode
  tableDensity: TableDensity
  showBreadcrumb: boolean
  showTabs: boolean
  animatePageTransition: boolean
  sidebarWidth: number
  setColorMode: (mode: ColorMode) => void
  setTableDensity: (density: TableDensity) => void
  setShowBreadcrumb: (show: boolean) => void
  setShowTabs: (show: boolean) => void
  setAnimatePageTransition: (animate: boolean) => void
  setSidebarWidth: (width: number) => void
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      colorMode: 'default',
      tableDensity: 'normal',
      showBreadcrumb: true,
      showTabs: true,
      animatePageTransition: true,
      sidebarWidth: 240,

      setColorMode: (colorMode) => set({ colorMode }),
      setTableDensity: (tableDensity) => set({ tableDensity }),
      setShowBreadcrumb: (showBreadcrumb) => set({ showBreadcrumb }),
      setShowTabs: (showTabs) => set({ showTabs }),
      setAnimatePageTransition: (animatePageTransition) => set({ animatePageTransition }),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
    }),
    {
      name: 'setting-storage',
    },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeStyle = 'default' | 'anime' | 'shinchan'
export type TableDensity = 'compact' | 'normal' | 'comfortable'

export interface SettingState {
  themeStyle: ThemeStyle
  tableDensity: TableDensity
  showBreadcrumb: boolean
  showTabs: boolean
  animatePageTransition: boolean
  sidebarWidth: number
  setThemeStyle: (style: ThemeStyle) => void
  setTableDensity: (density: TableDensity) => void
  setShowBreadcrumb: (show: boolean) => void
  setShowTabs: (show: boolean) => void
  setAnimatePageTransition: (animate: boolean) => void
  setSidebarWidth: (width: number) => void
}

function applyThemeStyle(style: ThemeStyle) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme-style', style)
  }
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      themeStyle: 'default',
      tableDensity: 'normal',
      showBreadcrumb: true,
      showTabs: true,
      animatePageTransition: true,
      sidebarWidth: 260,

      setThemeStyle: (themeStyle) => {
        applyThemeStyle(themeStyle)
        set({ themeStyle })
      },
      setTableDensity: (tableDensity) => set({ tableDensity }),
      setShowBreadcrumb: (showBreadcrumb) => set({ showBreadcrumb }),
      setShowTabs: (showTabs) => set({ showTabs }),
      setAnimatePageTransition: (animatePageTransition) => set({ animatePageTransition }),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
    }),
    {
      name: 'setting-storage',
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            applyThemeStyle(state.themeStyle)
          }
        }
      },
    },
  ),
)

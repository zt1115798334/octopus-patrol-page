import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeState {
  mode: ThemeMode
  resolved: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return getSystemTheme()
  return mode
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolved: getSystemTheme(),

      setMode: (mode: ThemeMode) => {
        const resolved = resolveTheme(mode)
        applyTheme(resolved)
        set({ mode, resolved })
      },

      toggle: () => {
        const current = get().resolved
        const next: 'light' | 'dark' = current === 'light' ? 'dark' : 'light'
        const mode: ThemeMode = next === getSystemTheme() ? 'system' : next
        applyTheme(next)
        set({ mode, resolved: next })
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            const resolved = resolveTheme(state.mode)
            applyTheme(resolved)
            state.resolved = resolved
          }
        }
      },
    },
  ),
)

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useThemeStore.getState()
    if (state.mode === 'system') {
      const resolved = getSystemTheme()
      applyTheme(resolved)
      useThemeStore.setState({ resolved })
    }
  })
}

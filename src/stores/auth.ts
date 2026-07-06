import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EnabledState } from '@/types'

export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  userId: number | null
  username: string | null
  account: string | null
  enabledState: EnabledState | null
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  setUserInfo: (info: {
    userId: number
    username: string
    account: string
    enabledState: EnabledState
  }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      userId: null,
      username: null,
      account: null,
      enabledState: null,

      login: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        set({ isAuthenticated: true, accessToken, refreshToken })
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          userId: null,
          username: null,
          account: null,
          enabledState: null,
        })
      },

      setUserInfo: (info) => {
        set({
          userId: info.userId,
          username: info.username,
          account: info.account,
          enabledState: info.enabledState,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        username: state.username,
        account: state.account,
        enabledState: state.enabledState,
      }),
    },
  ),
)

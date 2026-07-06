import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TabItem {
  id: string
  path: string
  label: string
  closable: boolean
}

export interface TabsState {
  tabs: TabItem[]
  activeTab: string | null
  addTab: (tab: TabItem) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  closeOtherTabs: (id: string) => void
  closeAllTabs: () => void
  closeRightTabs: (id: string) => void
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTab: null,

      addTab: (tab) => {
        const tabs = get().tabs
        const exists = tabs.find((t) => t.id === tab.id)
        if (!exists) {
          set({ tabs: [...tabs, tab], activeTab: tab.id })
        } else {
          set({ activeTab: tab.id })
        }
      },

      removeTab: (id) => {
        const tabs = get().tabs
        const index = tabs.findIndex((t) => t.id === id)
        const newTabs = tabs.filter((t) => t.id !== id)
        let activeTab = get().activeTab
        if (activeTab === id) {
          if (newTabs.length > 0) {
            activeTab = newTabs[Math.min(index, newTabs.length - 1)].id
          } else {
            activeTab = null
          }
        }
        set({ tabs: newTabs, activeTab })
      },

      setActiveTab: (id) => set({ activeTab: id }),

      closeOtherTabs: (id) => {
        set({ tabs: get().tabs.filter((t) => t.id === id || !t.closable) })
      },

      closeAllTabs: () => {
        set({ tabs: [], activeTab: null })
      },

      closeRightTabs: (id) => {
        const tabs = get().tabs
        const index = tabs.findIndex((t) => t.id === id)
        if (index === -1) return
        const newTabs = tabs.slice(0, index + 1)
        set({ tabs: newTabs, activeTab: id })
      },
    }),
    {
      name: 'tabs-storage',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTab: state.activeTab,
      }),
    },
  ),
)

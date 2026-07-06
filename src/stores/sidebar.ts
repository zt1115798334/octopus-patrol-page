import { create } from 'zustand'

export interface MenuItem {
  id: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  group?: string
  badge?: string | number
}

export interface SidebarState {
  collapsed: boolean
  expandedMenus: Set<string>
  recentMenus: string[]
  favorites: Set<string>
  searchQuery: string
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
  toggleMenu: (id: string) => void
  setExpanded: (id: string, expanded: boolean) => void
  addRecent: (id: string) => void
  toggleFavorite: (id: string) => void
  setSearchQuery: (query: string) => void
}

export const useSidebarStore = create<SidebarState>()((set, get) => ({
  collapsed: false,
  expandedMenus: new Set<string>(),
  recentMenus: [],
  favorites: new Set<string>(),
  searchQuery: '',

  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  setCollapsed: (collapsed) => set({ collapsed }),

  toggleMenu: (id) => {
    const expanded = new Set(get().expandedMenus)
    if (expanded.has(id)) {
      expanded.delete(id)
    } else {
      expanded.add(id)
    }
    set({ expandedMenus: expanded })
  },

  setExpanded: (id, expanded) => {
    const menus = new Set(get().expandedMenus)
    if (expanded) menus.add(id)
    else menus.delete(id)
    set({ expandedMenus: menus })
  },

  addRecent: (id) => {
    const recents = get().recentMenus.filter((r) => r !== id)
    recents.unshift(id)
    set({ recentMenus: recents.slice(0, 5) })
  },

  toggleFavorite: (id) => {
    const favorites = new Set(get().favorites)
    if (favorites.has(id)) {
      favorites.delete(id)
    } else {
      favorites.add(id)
    }
    set({ favorites })
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
}))

import { defineStore } from 'pinia'
import type { MenuItem } from '@/mock/data'

/**
 * 菜单状态接口
 */
export interface MenuState {
  menus: MenuItem[]
  activeMenu: string
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],
    activeMenu: ''
  }),

  getters: {
    // 获取菜单列表
    getMenus: (state) => state.menus,
    // 获取当前激活的菜单
    getActiveMenu: (state) => state.activeMenu
  },

  actions: {
    /**
     * 设置菜单列表
     */
    setMenus(menus: MenuItem[]) {
      this.menus = menus
    },

    /**
     * 设置当前激活的菜单
     */
    setActiveMenu(path: string) {
      this.activeMenu = path
    },

    /**
     * 清空菜单
     */
    clearMenus() {
      this.menus = []
      this.activeMenu = ''
    }
  },

  persist: true
})

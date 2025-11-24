import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import type { MenuItem } from '@/mock/data'
import { mergeRoutesWithMenus, sortRoutesByRank } from '@/utils/route'

/**
 * 路由状态接口
 */
export interface RouterState {
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
  mergedRoutes: RouteRecordRaw[]
  isRoutesAdded: boolean
}

export const useRouterStore = defineStore('router', {
  state: (): RouterState => ({
    routes: [],
    dynamicRoutes: [],
    mergedRoutes: [],
    isRoutesAdded: false
  }),

  getters: {
    // 获取所有路由
    getRoutes: (state) => state.routes,
    // 获取动态路由
    getDynamicRoutes: (state) => state.dynamicRoutes,
    // 获取合并后的路由
    getMergedRoutes: (state) => state.mergedRoutes,
    // 是否已添加路由
    getIsRoutesAdded: (state) => state.isRoutesAdded
  },

  actions: {
    /**
     * 设置路由
     */
    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = routes
    },

    /**
     * 添加动态路由
     */
    setDynamicRoutes(routes: RouteRecordRaw[]) {
      this.dynamicRoutes = routes
    },

    /**
     * 生成路由
     */
    async generateRoutes(menus: MenuItem[]) {
      try {
        console.log('🔄 开始生成动态路由...')
        console.log('📋 后端菜单数据:', menus)

        // 1. 获取本地静态路由
        const staticRoutes = router.getRoutes()
        console.log('📦 本地静态路由:', staticRoutes.length, '个')

        // 2. 将本地路由转换为 RouteRecordRaw 数组
        const localRoutes: RouteRecordRaw[] = staticRoutes.map((route) => ({
          path: route.path,
          name: route.name,
          meta: route.meta,
          component: route.components?.default
        })) as RouteRecordRaw[]

        // 3. 合并本地路由和后端菜单
        const mergedRoutes = mergeRoutesWithMenus(localRoutes, menus)

        // 4. 按 rank 排序
        const sortedRoutes = sortRoutesByRank(mergedRoutes)

        // 5. 保存合并后的路由
        this.routes = localRoutes
        this.mergedRoutes = sortedRoutes
        this.isRoutesAdded = true

        console.log('✅ 路由合并完成')
        console.log('📊 本地路由数:', localRoutes.length)
        console.log('📊 合并后路由数:', sortedRoutes.length)
        console.log('📊 合并后的路由:', sortedRoutes)

        return { success: true, routes: sortedRoutes }
      } catch (error) {
        const err = error as Error
        console.error('❌ 生成路由失败:', err)
        return { success: false, message: err.message }
      }
    },

    /**
     * 重置路由
     */
    resetRoutes() {
      this.routes = []
      this.dynamicRoutes = []
      this.isRoutesAdded = false
    }
  },

  persist: true
})

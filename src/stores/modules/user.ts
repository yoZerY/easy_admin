import { defineStore } from 'pinia'
import { mockLogin, mockGetUserInfo, mockGetUserMenus, mockLogout } from '@/mock/api'
import { useMenuStore } from './menu'
import { useRouterStore } from './router'
import type { MenuItem } from '@/mock/data'

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  roles: string[]
  permissions: string[]
}

/**
 * 用户状态接口
 */
export interface UserState {
  token: string
  refreshToken: string
  userInfo: UserInfo | null
  roles: string[]
  permissions: string[]
  isLogin: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    refreshToken: '',
    userInfo: null,
    roles: [],
    permissions: [],
    isLogin: false
  }),

  getters: {
    // 是否是超级管理员
    isSuperAdmin: (state) => state.roles.includes('admin')
  },

  actions: {
    /**
     * 设置 Token
     */
    setToken(token: string) {
      this.token = token
    },

    /**
     * 设置用户信息
     */
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.roles = userInfo.roles || []
      this.permissions = userInfo.permissions || []
      this.isLogin = true
    },

    /**
     * 登录
     */
    async login(username: string, password: string) {
      try {
        const menuStore = useMenuStore()
        const routerStore = useRouterStore()

        // 1. 调用登录接口，获取 Token
        console.log('🔐 步骤1: 调用登录接口...')
        const loginRes = await mockLogin(username, password)
        const { accessToken, refreshToken } = loginRes.data
        console.log('✅ 登录成功，获取到 Token:', { accessToken, refreshToken })

        // 保存 Token
        this.token = accessToken
        this.refreshToken = refreshToken

        // 2. 获取用户信息
        console.log('👤 步骤2: 获取用户信息...')
        const userInfoRes = await mockGetUserInfo(accessToken)
        this.setUserInfo(userInfoRes.data)
        console.log('✅ 用户信息获取成功:', userInfoRes.data)

        // 3. 获取用户菜单
        console.log('📋 步骤3: 获取用户菜单...')
        const menusRes = await mockGetUserMenus(accessToken)
        const menus = menusRes.data as MenuItem[]
        menuStore.setMenus(menus)
        console.log('✅ 菜单获取成功:', menus)

        // 4. 生成动态路由
        console.log('🛣️ 步骤4: 生成动态路由...')
        await routerStore.generateRoutes(menus)
        console.log('✅ 路由生成完成')

        return { success: true, data: userInfoRes.data }
      } catch (error) {
        const err = error as Error
        console.error('❌ 登录失败:', err)
        return { success: false, message: err.message || '登录失败' }
      }
    },

    /**
     * 获取用户信息
     */
    async getUserInfoFromServer() {
      try {
        const menuStore = useMenuStore()
        const routerStore = useRouterStore()

        if (!this.token) {
          throw new Error('未登录')
        }

        // 获取用户信息
        const userInfoRes = await mockGetUserInfo(this.token)
        this.setUserInfo(userInfoRes.data)

        // 获取用户菜单
        const menusRes = await mockGetUserMenus(this.token)
        const menus = menusRes.data as MenuItem[]
        menuStore.setMenus(menus)

        // 生成动态路由
        if (!routerStore.isRoutesAdded) {
          await routerStore.generateRoutes(menus)
        }

        return { success: true, data: userInfoRes.data }
      } catch (error) {
        const err = error as Error
        console.error('获取用户信息失败:', err)
        return { success: false, message: err.message || '获取用户信息失败' }
      }
    },

    /**
     * 登出
     */
    async logout() {
      try {
        const menuStore = useMenuStore()
        const routerStore = useRouterStore()

        if (this.token) {
          await mockLogout(this.token)
        }

        this.token = ''
        this.refreshToken = ''
        this.userInfo = null
        this.roles = []
        this.permissions = []
        this.isLogin = false

        // 清空菜单
        menuStore.clearMenus()

        // 重置路由
        routerStore.resetRoutes()

        return { success: true }
      } catch (error) {
        const err = error as Error
        console.error('登出失败:', err)
        return { success: false, message: err.message || '登出失败' }
      }
    },

    /**
     * 检查是否有权限
     */
    hasPermission(permission: string | string[]): boolean {
      // 超级管理员拥有所有权限
      if (this.permissions.includes('*:*:*')) {
        return true
      }

      const perms = Array.isArray(permission) ? permission : [permission]
      return perms.some((perm) => this.permissions.includes(perm))
    },

    /**
     * 检查是否有角色
     */
    hasRole(role: string | string[]): boolean {
      const roles = Array.isArray(role) ? role : [role]
      return roles.some((r) => this.roles.includes(r))
    }
  },

  persist: true
})

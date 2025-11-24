import type { Router } from 'vue-router'
import NProgress from '@/utils/nprogress'
import { useUserStore } from '@/stores/modules/user'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { useMenuStore } from '@/stores/modules/menu'

/**
 * 白名单路由（不需要登录）
 */
const WHITE_LIST = ['/login', '/404', '/403']

/**
 * 设置路由守卫
 */
export function setupRouterGuard(router: Router) {
  /**
   * 全局前置守卫
   */
  router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    console.log('🛣️ 路由守卫: 从', from.path, '到', to.path)

    const userStore = useUserStore()
    const tagsViewStore = useTagsViewStore()
    const menuStore = useMenuStore()

    // 设置页面标题
    document.title = (to.meta?.title as string) || '后台管理系统'

    // 判断是否在白名单中
    if (WHITE_LIST.includes(to.path)) {
      console.log('✅ 白名单路由，直接放行')
      next()
      return
    }

    // 判断是否已登录
    if (!userStore.isLogin) {
      console.log('❌ 未登录，跳转到登录页')
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    console.log('✅ 已登录，检查用户信息和菜单...')
    console.log('用户信息:', userStore.userInfo)
    console.log('菜单数量:', menuStore.getMenus.length)

    // 已登录，检查是否有用户信息和菜单
    if (!userStore.userInfo || menuStore.getMenus.length === 0) {
      console.log('⚠️ 缺少用户信息或菜单，重新获取...')
      try {
        // 获取用户信息（会同时获取菜单和生成路由）
        await userStore.getUserInfoFromServer()
        console.log('✅ 用户信息和菜单获取成功')
      } catch (error) {
        console.error('❌ 获取用户信息失败:', error)
        // 获取用户信息失败，清除 token 并跳转到登录页
        await userStore.logout()
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }

    // 检查路由权限
    if (to.meta?.roles || to.meta?.auths) {
      console.log('🔒 检查路由权限...')
      // 检查角色权限
      if (to.meta.roles && !userStore.hasRole(to.meta.roles as string[])) {
        console.log('❌ 没有角色权限')
        next({ path: '/403' })
        return
      }

      // 检查操作权限
      if (to.meta.auths && !userStore.hasPermission(to.meta.auths as string[])) {
        console.log('❌ 没有操作权限')
        next({ path: '/403' })
        return
      }
      console.log('✅ 权限检查通过')
    }

    // 添加到标签页
    if (to.name && to.meta?.title) {
      tagsViewStore.addView(to)
    }

    console.log('✅ 路由守卫放行，跳转到:', to.path)
    next()
  })

  /**
   * 全局后置守卫
   */
  router.afterEach((to) => {
    // 结束进度条
    NProgress.done()

    // 可以在这里做一些统计、埋点等操作
    console.log('路由跳转完成:', to.path)
  })

  /**
   * 全局错误处理
   */
  router.onError((error) => {
    // 结束进度条
    NProgress.done()
    console.error('路由错误:', error)
  })
}

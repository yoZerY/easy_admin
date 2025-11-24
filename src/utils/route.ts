import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/mock/data'

/**
 * 路由合并工具
 */

/**
 * 根据路径查找本地路由
 */
export function findLocalRoute(routes: RouteRecordRaw[], path: string): RouteRecordRaw | undefined {
  for (const route of routes) {
    if (route.path === path) {
      return route
    }
    if (route.children) {
      const found = findLocalRoute(route.children, path)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 合并后端菜单和本地路由
 * 策略：以后端菜单为主，本地路由提供组件，主要做去重
 */
export function mergeRoutesWithMenus(
  localRoutes: RouteRecordRaw[],
  backendMenus: MenuItem[]
): RouteRecordRaw[] {
  console.log('🔄 开始合并路由...')
  console.log('📦 本地路由数量:', localRoutes.length)
  console.log('📋 后端菜单数量:', backendMenus.length)

  // 创建本地路由路径映射（用于查找组件）
  const localRouteMap = new Map<string, RouteRecordRaw>()
  localRoutes.forEach((route) => {
    localRouteMap.set(route.path, route)
  })

  // 用于去重的 Set
  const addedPaths = new Set<string>()

  // 递归处理菜单项
  const processMenuItem = (menu: MenuItem): RouteRecordRaw | null => {
    // 去重：如果已经添加过，跳过
    if (addedPaths.has(menu.path)) {
      console.log(`⚠️ 菜单 ${menu.path} 重复，已跳过`)
      return null
    }

    // 查找本地路由
    const localRoute = localRouteMap.get(menu.path)

    let mergedRoute: RouteRecordRaw

    if (localRoute) {
      // 如果本地有对应的路由，使用本地路由的组件，合并后端菜单的 meta
      mergedRoute = {
        ...localRoute,
        meta: {
          ...localRoute.meta,
          ...menu.meta,
          // 确保使用后端的配置
          title: menu.meta.title,
          icon: menu.meta.icon,
          rank: menu.meta.rank,
          showLink: menu.meta.showLink
        }
      }

      console.log(`✅ 路由 ${menu.path} 合并成功（使用本地组件 + 后端配置）`)
    } else {
      // 如果本地没有对应的路由，创建一个新路由（使用后端配置）
      mergedRoute = {
        path: menu.path,
        name: menu.name,
        meta: {
          ...menu.meta
        },
        // 尝试动态导入组件
        component: () =>
          import(`@/views${menu.path}/index.vue`).catch(() => {
            console.warn(`⚠️ 组件 @/views${menu.path}/index.vue 不存在`)
            // 返回一个空组件或 404 页面
            return import('@/views/error/404.vue').catch(() => ({
              template: '<div>页面不存在</div>'
            }))
          })
      }
      console.log(`✅ 路由 ${menu.path} 创建成功（使用后端配置）`)
    }

    // 处理后端菜单的 children
    if (menu.children && menu.children.length > 0) {
      const childRoutes: RouteRecordRaw[] = []
      menu.children.forEach((childMenu) => {
        const childRoute = processMenuItem(childMenu)
        if (childRoute) {
          childRoutes.push(childRoute)
        }
      })
      if (childRoutes.length > 0) {
        mergedRoute.children = childRoutes
        console.log(`  └─ 包含 ${childRoutes.length} 个子路由`)
      }
    } else if (localRoute?.children && localRoute.children.length > 0) {
      // 如果后端没有 children，但本地有，保留本地的 children
      mergedRoute.children = localRoute.children
      console.log(`  └─ 保留本地 ${localRoute.children.length} 个子路由`)
    }

    addedPaths.add(menu.path)
    return mergedRoute
  }

  // 以后端菜单为主，构建路由
  const mergedRoutes: RouteRecordRaw[] = []

  backendMenus.forEach((menu) => {
    const route = processMenuItem(menu)
    if (route) {
      mergedRoutes.push(route)
    }
  })

  console.log('✅ 路由合并完成，最终路由数量:', mergedRoutes.length)
  console.log('📊 合并后的路由:', mergedRoutes)
  return mergedRoutes
}

/**
 * 根据权限过滤路由
 */
export function filterRoutesByPermission(
  routes: RouteRecordRaw[],
  roles: string[],
  permissions: string[]
): RouteRecordRaw[] {
  return routes.filter((route) => {
    // 检查角色权限
    if (route.meta?.roles) {
      const routeRoles = route.meta.roles as string[]
      if (!routeRoles.some((role) => roles.includes(role))) {
        return false
      }
    }

    // 检查操作权限
    if (route.meta?.auths) {
      const routeAuths = route.meta.auths as string[]
      // 超级管理员拥有所有权限
      if (!permissions.includes('*:*:*')) {
        if (!routeAuths.some((auth) => permissions.includes(auth))) {
          return false
        }
      }
    }

    // 递归过滤子路由
    if (route.children) {
      route.children = filterRoutesByPermission(route.children, roles, permissions)
    }

    return true
  })
}

/**
 * 扁平化路由
 */
export function flattenRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  function flatten(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      result.push(route)
      if (route.children) {
        flatten(route.children)
      }
    })
  }

  flatten(routes)
  return result
}

/**
 * 按 rank 排序路由
 */
export function sortRoutesByRank(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.sort((a, b) => {
    const rankA = (a.meta?.rank as number) ?? 999
    const rankB = (b.meta?.rank as number) ?? 999
    return rankA - rankB
  })
}

/**
 * 生成路由面包屑
 */
export function generateBreadcrumb(route: RouteRecordRaw): Array<{ title: string; path: string }> {
  const breadcrumb: Array<{ title: string; path: string }> = []

  function traverse(route: RouteRecordRaw) {
    if (route.meta?.title) {
      breadcrumb.push({
        title: route.meta.title as string,
        path: route.path
      })
    }
  }

  traverse(route)
  return breadcrumb
}

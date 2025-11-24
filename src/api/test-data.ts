/**
 * 测试数据 - 模拟后端返回的数据
 */

import type { UserInfo } from '@/stores/modules/user'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 登录响应数据
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

/**
 * 用户信息响应数据
 */
export interface UserInfoResponse extends UserInfo {
  permissions: string[]
}

/**
 * 菜单数据
 */
export interface MenuData {
  id: number
  path: string
  name: string
  component?: string
  redirect?: string
  meta: {
    title: string
    icon?: string
    rank?: number
    showLink?: boolean
    roles?: string[]
    auths?: string[]
  }
  children?: MenuData[]
}

/**
 * 测试用户数据
 */
const TEST_USERS = {
  admin: {
    accessToken: 'admin-access-token-' + Date.now(),
    refreshToken: 'admin-refresh-token-' + Date.now(),
    userInfo: {
      id: 1,
      username: 'admin',
      nickname: '超级管理员',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
      email: 'admin@example.com',
      phone: '13800138000',
      roles: ['admin'],
      permissions: ['*:*:*']
    },
    menus: [
      {
        id: 1,
        path: '/',
        name: 'Home',
        redirect: '/welcome',
        meta: {
          title: '首页',
          icon: 'ri:home-4-line',
          rank: 1,
          showLink: true
        },
        children: [
          {
            id: 11,
            path: '/welcome',
            name: 'Welcome',
            component: '/views/welcome/index.vue',
            meta: {
              title: '欢迎页',
              icon: 'ri:dashboard-line',
              showLink: true
            }
          }
        ]
      },
      {
        id: 2,
        path: '/system',
        name: 'System',
        redirect: '/system/user',
        meta: {
          title: '系统管理',
          icon: 'ri:settings-3-line',
          rank: 2,
          showLink: true
        },
        children: [
          {
            id: 21,
            path: '/system/user',
            name: 'SystemUser',
            component: '/views/system/user/index.vue',
            meta: {
              title: '用户管理',
              icon: 'ri:user-line',
              showLink: true,
              roles: ['admin'],
              auths: ['system:user:list']
            }
          },
          {
            id: 22,
            path: '/system/role',
            name: 'SystemRole',
            component: '/views/system/role/index.vue',
            meta: {
              title: '角色管理',
              icon: 'ri:admin-line',
              showLink: true,
              roles: ['admin'],
              auths: ['system:role:list']
            }
          },
          {
            id: 23,
            path: '/system/menu',
            name: 'SystemMenu',
            component: '/views/system/menu/index.vue',
            meta: {
              title: '菜单管理',
              icon: 'ri:menu-line',
              showLink: true,
              roles: ['admin'],
              auths: ['system:menu:list']
            }
          },
          {
            id: 24,
            path: '/system/department',
            name: 'SystemDept',
            component: '/views/system/department/index.vue',
            meta: {
              title: '部门管理',
              icon: 'ri:organization-chart',
              showLink: true,
              roles: ['admin'],
              auths: ['system:dept:list']
            }
          }
        ]
      },
      {
        id: 3,
        path: '/dashboard',
        name: 'Dashboard',
        redirect: '/dashboard/analysis',
        meta: {
          title: '数据看板',
          icon: 'ri:dashboard-line',
          rank: 3,
          showLink: true
        },
        children: [
          {
            id: 31,
            path: '/dashboard/analysis',
            name: 'DashboardAnalysis',
            component: '/views/dashboard/analysis/index.vue',
            meta: {
              title: '数据分析',
              icon: 'ri:line-chart-line',
              showLink: true
            }
          },
          {
            id: 32,
            path: '/dashboard/workbench',
            name: 'DashboardWorkbench',
            component: '/views/dashboard/workbench/index.vue',
            meta: {
              title: '工作台',
              icon: 'ri:computer-line',
              showLink: true
            }
          }
        ]
      },
      {
        id: 4,
        path: '/components',
        name: 'Components',
        redirect: '/components/button',
        meta: {
          title: '组件示例',
          icon: 'ri:apps-line',
          rank: 4,
          showLink: true
        },
        children: [
          {
            id: 41,
            path: '/components/button',
            name: 'ComponentButton',
            component: '/views/components/button/index.vue',
            meta: {
              title: '按钮',
              icon: 'ri:checkbox-blank-circle-line',
              showLink: true
            }
          },
          {
            id: 42,
            path: '/components/table',
            name: 'ComponentTable',
            component: '/views/components/table/index.vue',
            meta: {
              title: '表格',
              icon: 'ri:table-line',
              showLink: true
            }
          },
          {
            id: 43,
            path: '/components/form',
            name: 'ComponentForm',
            component: '/views/components/form/index.vue',
            meta: {
              title: '表单',
              icon: 'ri:file-list-line',
              showLink: true
            }
          },
          {
            id: 44,
            path: '/components/permission',
            name: 'ComponentPermission',
            component: '/views/demo/permission.vue',
            meta: {
              title: '权限演示',
              icon: 'ri:shield-check-line',
              showLink: true
            }
          },
          {
            id: 45,
            path: '/components/nprogress',
            name: 'ComponentNProgress',
            component: '/views/demo/nprogress.vue',
            meta: {
              title: '进度条演示',
              icon: 'ri:loader-line',
              showLink: true
            }
          }
        ]
      }
    ]
  },
  user: {
    accessToken: 'user-access-token-' + Date.now(),
    refreshToken: 'user-refresh-token-' + Date.now(),
    userInfo: {
      id: 2,
      username: 'user',
      nickname: '普通用户',
      avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
      email: 'user@example.com',
      phone: '13800138001',
      roles: ['user'],
      permissions: ['system:user:list', 'dashboard:*:*']
    },
    menus: [
      {
        id: 1,
        path: '/',
        name: 'Home',
        redirect: '/welcome',
        meta: {
          title: '首页',
          icon: 'ri:home-4-line',
          rank: 1,
          showLink: true
        },
        children: [
          {
            id: 11,
            path: '/welcome',
            name: 'Welcome',
            component: '/views/welcome/index.vue',
            meta: {
              title: '欢迎页',
              icon: 'ri:dashboard-line',
              showLink: true
            }
          }
        ]
      },
      {
        id: 3,
        path: '/dashboard',
        name: 'Dashboard',
        redirect: '/dashboard/analysis',
        meta: {
          title: '数据看板',
          icon: 'ri:dashboard-line',
          rank: 3,
          showLink: true
        },
        children: [
          {
            id: 31,
            path: '/dashboard/analysis',
            name: 'DashboardAnalysis',
            component: '/views/dashboard/analysis/index.vue',
            meta: {
              title: '数据分析',
              icon: 'ri:line-chart-line',
              showLink: true
            }
          }
        ]
      }
    ]
  }
}

/**
 * 模拟登录接口
 */
export function mockLogin(username: string, password: string): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = TEST_USERS[username as keyof typeof TEST_USERS]

      if (!user) {
        reject(new Error('用户名或密码错误'))
        return
      }

      if (password !== username) {
        reject(new Error('用户名或密码错误'))
        return
      }

      resolve({
        accessToken: user.accessToken,
        refreshToken: user.refreshToken
      })
    }, 500)
  })
}

/**
 * 模拟获取用户信息接口
 */
export function mockGetUserInfo(token: string): Promise<UserInfoResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 根据 token 判断用户
      const user = token.includes('admin')
        ? TEST_USERS.admin
        : token.includes('user')
          ? TEST_USERS.user
          : null

      if (!user) {
        reject(new Error('Token 无效'))
        return
      }

      resolve(user.userInfo)
    }, 300)
  })
}

/**
 * 模拟获取用户菜单接口
 */
export function mockGetUserMenus(token: string): Promise<MenuData[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 根据 token 判断用户
      const user = token.includes('admin')
        ? TEST_USERS.admin
        : token.includes('user')
          ? TEST_USERS.user
          : null

      if (!user) {
        reject(new Error('Token 无效'))
        return
      }

      resolve(user.menus)
    }, 300)
  })
}

/**
 * Mock 数据
 */

import type { UserInfo } from '@/stores/modules/user'

/**
 * 用户数据
 */
export const mockUsers = [
  {
    username: 'admin',
    password: 'admin',
    userInfo: {
      id: 1,
      username: 'admin',
      nickname: '超级管理员',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
      email: 'admin@example.com',
      phone: '13800138000',
      roles: ['admin'],
      permissions: ['*:*:*']
    } as UserInfo
  },
  {
    username: 'user',
    password: 'user',
    userInfo: {
      id: 2,
      username: 'user',
      nickname: '普通用户',
      avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
      email: 'user@example.com',
      phone: '13800138001',
      roles: ['user'],
      permissions: [
        'system:user:list',
        'system:role:list',
        'dashboard:analysis:view',
        'dashboard:workbench:view'
      ]
    } as UserInfo
  },
  {
    username: 'editor',
    password: 'editor',
    userInfo: {
      id: 3,
      username: 'editor',
      nickname: '编辑人员',
      avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
      email: 'editor@example.com',
      phone: '13800138002',
      roles: ['editor'],
      permissions: [
        'system:user:list',
        'system:user:add',
        'system:user:edit',
        'system:role:list',
        'data:*:*'
      ]
    } as UserInfo
  }
]

/**
 * 菜单项类型
 */
export interface MenuItem {
  path: string
  name: string
  meta: {
    icon: string
    title: string
    rank: number
    showLink: boolean
  }
  children?: MenuItem[]
}

/**
 * 管理员菜单
 */
export const adminMenus: MenuItem[] = [
  {
    path: '/',
    name: 'Home',
    meta: {
      icon: 'ri:home-4-line',
      title: '首页',
      rank: 1,
      showLink: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      icon: 'ri:dashboard-line',
      title: '仪表盘',
      rank: 2,
      showLink: true
    },
    children: [
      {
        path: '/dashboard/analysis',
        name: 'DashboardAnalysis',
        meta: {
          icon: 'ri:line-chart-line',
          title: '数据分析',
          rank: 1,
          showLink: true
        }
      },
      {
        path: '/dashboard/workbench',
        name: 'DashboardWorkbench',
        meta: {
          icon: 'ri:dashboard-3-line',
          title: '工作台',
          rank: 2,
          showLink: true
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    meta: {
      icon: 'ri:settings-3-line',
      title: '系统管理',
      rank: 3,
      showLink: true
    },
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        meta: {
          icon: 'ri:user-line',
          title: '用户管理',
          rank: 1,
          showLink: true
        }
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        meta: {
          icon: 'ri:admin-line',
          title: '角色管理',
          rank: 2,
          showLink: true
        }
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        meta: {
          icon: 'ri:menu-line',
          title: '菜单管理',
          rank: 3,
          showLink: true
        }
      },
      {
        path: '/system/department',
        name: 'SystemDept',
        meta: {
          icon: 'ri:organization-chart',
          title: '部门管理',
          rank: 4,
          showLink: true
        }
      }
    ]
  },
  {
    path: '/data',
    name: 'Data',
    meta: {
      icon: 'ri:database-line',
      title: '数据管理',
      rank: 4,
      showLink: true
    }
  },
  {
    path: '/monitor',
    name: 'Monitor',
    meta: {
      icon: 'ri:eye-line',
      title: '系统监控',
      rank: 5,
      showLink: true
    }
  },
  {
    path: '/components',
    name: 'Components',
    meta: {
      icon: 'ri:apps-line',
      title: '组件示例',
      rank: 6,
      showLink: true
    }
  },
  {
    path: '/user',
    name: 'User',
    meta: {
      icon: 'ri:user-settings-line',
      title: '个人中心',
      rank: 7,
      showLink: true
    }
  }
]

/**
 * 普通用户菜单
 */
export const userMenus: MenuItem[] = [
  {
    path: '/',
    name: 'Home',
    meta: {
      icon: 'ri:home-4-line',
      title: '首页',
      rank: 1,
      showLink: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      icon: 'ri:dashboard-line',
      title: '仪表盘',
      rank: 2,
      showLink: true
    }
  },
  {
    path: '/components',
    name: 'Components',
    meta: {
      icon: 'ri:apps-line',
      title: '组件示例',
      rank: 3,
      showLink: true
    }
  },
  {
    path: '/user',
    name: 'User',
    meta: {
      icon: 'ri:user-settings-line',
      title: '个人中心',
      rank: 4,
      showLink: true
    }
  }
]

/**
 * 编辑人员菜单
 */
export const editorMenus: MenuItem[] = [
  {
    path: '/',
    name: 'Home',
    meta: {
      icon: 'ri:home-4-line',
      title: '首页',
      rank: 1,
      showLink: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      icon: 'ri:dashboard-line',
      title: '仪表盘',
      rank: 2,
      showLink: true
    }
  },
  {
    path: '/data',
    name: 'Data',
    meta: {
      icon: 'ri:database-line',
      title: '数据管理',
      rank: 3,
      showLink: true
    }
  },
  {
    path: '/components',
    name: 'Components',
    meta: {
      icon: 'ri:apps-line',
      title: '组件示例',
      rank: 4,
      showLink: true
    }
  },
  {
    path: '/user',
    name: 'User',
    meta: {
      icon: 'ri:user-settings-line',
      title: '个人中心',
      rank: 5,
      showLink: true
    }
  }
]

/**
 * 根据角色获取菜单
 */
export function getMenusByRoles(roles: string[]): MenuItem[] {
  if (roles.includes('admin')) {
    return adminMenus
  } else if (roles.includes('editor')) {
    return editorMenus
  } else {
    return userMenus
  }
}

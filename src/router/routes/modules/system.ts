import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default {
  path: '/system',
  name: 'System',
  component: Layout,
  redirect: '/system/user',
  meta: {
    icon: 'ri:settings-3-line',
    title: '系统管理',
    rank: 2,
    showLink: true
  },
  children: [
    {
      path: '/system/user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        icon: 'ri:user-line',
        title: '用户管理',
        showLink: true,
        roles: ['admin'],
        auths: ['system:user:list']
      }
    },
    {
      path: '/system/role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        icon: 'ri:admin-line',
        title: '角色管理',
        showLink: true,
        roles: ['admin'],
        auths: ['system:role:list']
      }
    },
    {
      path: '/system/menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        icon: 'ri:menu-line',
        title: '菜单管理',
        showLink: true,
        roles: ['admin'],
        auths: ['system:menu:list']
      }
    },
    {
      path: '/system/department',
      name: 'SystemDept',
      component: () => import('@/views/system/department/index.vue'),
      meta: {
        icon: 'ri:organization-chart',
        title: '部门管理',
        showLink: true,
        roles: ['admin'],
        auths: ['system:dept:list']
      }
    }
  ]
} as RouteRecordRaw

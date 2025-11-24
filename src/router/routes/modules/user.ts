import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default {
  path: '/user',
  name: 'User',
  component: Layout,
  redirect: '/user/profile',
  meta: {
    icon: 'ri:user-settings-line',
    title: '个人中心',
    rank: 5
  },
  children: [
    {
      path: '/user/profile',
      name: 'UserProfile',
      component: () => import('@/views/user/profile/index.vue'),
      meta: {
        icon: 'ri:user-line',
        title: '个人信息'
      }
    },
    {
      path: '/user/settings',
      name: 'UserSettings',
      component: () => import('@/views/user/settings/index.vue'),
      meta: {
        icon: 'ri:settings-3-line',
        title: '账号设置'
      }
    },
    {
      path: '/user/security',
      name: 'UserSecurity',
      component: () => import('@/views/user/security/index.vue'),
      meta: {
        icon: 'ri:shield-check-line',
        title: '安全设置'
      }
    }
  ]
} as RouteRecordRaw

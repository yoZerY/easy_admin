import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
    hiddenTag: true
  }
} as RouteRecordRaw

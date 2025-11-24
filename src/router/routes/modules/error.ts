import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/error',
  name: 'Error',
  redirect: '/404',
  meta: {
    title: '错误页面',
    hiddenTag: true
  },
  children: [
    {
      path: '/403',
      name: 'Error403',
      component: () => import('@/views/error/403.vue'),
      meta: {
        title: '403 - 无权限',
        hiddenTag: true
      }
    },
    {
      path: '/404',
      name: 'Error404',
      component: () => import('@/views/error/404.vue'),
      meta: {
        title: '404 - 页面不存在',
        hiddenTag: true
      }
    }
  ]
} as RouteRecordRaw

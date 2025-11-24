import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default {
  path: '/',
  name: 'Home',
  component: Layout,
  redirect: '/welcome',
  meta: {
    icon: 'ri:home-4-line',
    title: '首页',
    rank: 1,
    showLink: true
  },
  children: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/views/welcome/index.vue'),
      meta: {
        icon: 'ri:dashboard-line',
        title: '欢迎页',
        showLink: true,
        showParent: false
      }
    }
  ]
} as RouteRecordRaw

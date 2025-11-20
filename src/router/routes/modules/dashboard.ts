import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default {
  path: '/dashboard',
  name: 'Dashboard',
  component: Layout,
  redirect: '/dashboard/analysis',
  meta: {
    icon: 'ri:dashboard-line',
    title: '仪表盘',
    rank: 3
  },
  children: [
    {
      path: '/dashboard/analysis',
      name: 'DashboardAnalysis',
      component: () => import('@/views/dashboard/analysis/index.vue'),
      meta: {
        icon: 'ri:line-chart-line',
        title: '分析页'
      }
    },
    {
      path: '/dashboard/workbench',
      name: 'DashboardWorkbench',
      component: () => import('@/views/dashboard/workbench/index.vue'),
      meta: {
        icon: 'ri:computer-line',
        title: '工作台'
      }
    }
  ]
} as RouteRecordRaw

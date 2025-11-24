import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default {
  path: '/monitor',
  name: 'Monitor',
  component: Layout,
  redirect: '/monitor/online',
  meta: {
    icon: 'ri:radar-line',
    title: '系统监控',
    rank: 7
  },
  children: [
    {
      path: '/monitor/online',
      name: 'MonitorOnline',
      component: () => import('@/views/monitor/online/index.vue'),
      meta: {
        icon: 'ri:user-voice-line',
        title: '在线用户'
      }
    },
    {
      path: '/monitor/server',
      name: 'MonitorServer',
      component: () => import('@/views/monitor/server/index.vue'),
      meta: {
        icon: 'ri:server-line',
        title: '服务监控'
      }
    },
    {
      path: '/monitor/logs',
      name: 'MonitorLogs',
      component: () => import('@/views/monitor/logs/index.vue'),
      meta: {
        icon: 'ri:file-list-3-line',
        title: '操作日志'
      }
    }
  ]
} as RouteRecordRaw

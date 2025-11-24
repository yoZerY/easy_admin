import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default {
  path: '/data',
  name: 'Data',
  component: Layout,
  redirect: '/data/list',
  meta: {
    icon: 'ri:database-2-line',
    title: '数据管理',
    rank: 6
  },
  children: [
    {
      path: '/data/list',
      name: 'DataList',
      component: () => import('@/views/data/list/index.vue'),
      meta: {
        icon: 'ri:list-check',
        title: '数据列表'
      }
    },
    {
      path: '/data/import',
      name: 'DataImport',
      component: () => import('@/views/data/import/index.vue'),
      meta: {
        icon: 'ri:upload-cloud-line',
        title: '数据导入'
      }
    },
    {
      path: '/data/export',
      name: 'DataExport',
      component: () => import('@/views/data/export/index.vue'),
      meta: {
        icon: 'ri:download-cloud-line',
        title: '数据导出'
      }
    },
    {
      path: '/data/backup',
      name: 'DataBackup',
      component: () => import('@/views/data/backup/index.vue'),
      meta: {
        icon: 'ri:save-line',
        title: '数据备份'
      }
    }
  ]
} as RouteRecordRaw

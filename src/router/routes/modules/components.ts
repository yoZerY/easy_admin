import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default {
  path: '/components',
  name: 'Components',
  component: Layout,
  redirect: '/components/button',
  meta: {
    icon: 'ri:apps-line',
    title: '组件示例',
    rank: 4
  },
  children: [
    {
      path: '/components/button',
      name: 'ComponentButton',
      component: () => import('@/views/components/button/index.vue'),
      meta: {
        icon: 'ri:checkbox-blank-circle-line',
        title: '按钮'
      }
    },
    {
      path: '/components/table',
      name: 'ComponentTable',
      component: () => import('@/views/components/table/index.vue'),
      meta: {
        icon: 'ri:table-line',
        title: '表格'
      }
    },
    {
      path: '/components/form',
      name: 'ComponentForm',
      component: () => import('@/views/components/form/index.vue'),
      meta: {
        icon: 'ri:file-list-line',
        title: '表单'
      }
    },
    {
      path: '/components/permission',
      name: 'ComponentPermission',
      component: () => import('@/views/demo/permission.vue'),
      meta: {
        icon: 'ri:shield-check-line',
        title: '权限演示'
      }
    },
    {
      path: '/components/nprogress',
      name: 'ComponentNProgress',
      component: () => import('@/views/demo/nprogress.vue'),
      meta: {
        icon: 'ri:loader-line',
        title: '进度条演示'
      }
    },
    {
      path: '/components/login-flow',
      name: 'ComponentLoginFlow',
      component: () => import('@/views/demo/login-flow.vue'),
      meta: {
        icon: 'ri:login-box-line',
        title: '登录流程演示'
      }
    }
  ]
} as RouteRecordRaw

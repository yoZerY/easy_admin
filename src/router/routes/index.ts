import type { RouteRecordRaw } from 'vue-router'

import dashboard from './modules/dashboard'
import system from './modules/system'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  dashboard,
  system
]

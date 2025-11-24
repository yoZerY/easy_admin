import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes/index'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

// 设置路由守卫
setupRouterGuard(router)

export default router

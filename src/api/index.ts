/**
 * API 统一导出
 */

export * from './types'
export * from './modules/auth'
export * from './modules/user'
export * from './modules/role'

// 导入所有 API
import { authApi } from './modules/auth'
import { userApi } from './modules/user'
import { roleApi } from './modules/role'

// 统一导出
export const api = {
  auth: authApi,
  user: userApi,
  role: roleApi
}

export default api

import { request } from '@/utils/request'
import type { UserInfo } from '@/stores/modules/user'

/**
 * 登录参数
 */
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

/**
 * 登录响应
 */
export interface LoginResult {
  token: string
  userInfo: UserInfo
}

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 登录
   */
  login(data: LoginParams) {
    return request.post<LoginResult>('/auth/login', data, {
      showLoading: true,
      showError: true
    })
  },

  /**
   * 登出
   */
  logout() {
    return request.post(
      '/auth/logout',
      {},
      {
        showLoading: false
      }
    )
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return request.get<UserInfo>(
      '/auth/userinfo',
      {},
      {
        showLoading: false
      }
    )
  },

  /**
   * 刷新 Token
   */
  refreshToken(refreshToken: string) {
    return request.post<{ token: string }>('/auth/refresh', { refreshToken })
  },

  /**
   * 修改密码
   */
  changePassword(data: { oldPassword: string; newPassword: string }) {
    return request.post('/auth/change-password', data, {
      showSuccess: true,
      successMessage: '密码修改成功'
    })
  }
}

import { request } from '@/utils/request'
import type { PageParams, PageResult, IdParam } from '../types'

/**
 * 用户信息
 */
export interface User {
  id: number
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  status: number
  roles: string[]
  createTime: string
  updateTime?: string
}

/**
 * 用户查询参数
 */
export interface UserQueryParams extends PageParams {
  username?: string
  nickname?: string
  status?: number
}

/**
 * 用户创建/更新参数
 */
export interface UserFormData {
  id?: number
  username: string
  nickname: string
  password?: string
  email?: string
  phone?: string
  status: number
  roleIds: number[]
}

/**
 * 用户管理 API
 */
export const userApi = {
  /**
   * 获取用户列表
   */
  getList(params: UserQueryParams) {
    return request.get<PageResult<User>>('/system/user/list', params)
  },

  /**
   * 获取用户详情
   */
  getDetail(id: number) {
    return request.get<User>(`/system/user/${id}`)
  },

  /**
   * 创建用户
   */
  create(data: UserFormData) {
    return request.post('/system/user', data, {
      showSuccess: true,
      successMessage: '创建成功'
    })
  },

  /**
   * 更新用户
   */
  update(data: UserFormData) {
    return request.put(`/system/user/${data.id}`, data, {
      showSuccess: true,
      successMessage: '更新成功'
    })
  },

  /**
   * 删除用户
   */
  delete(params: IdParam) {
    return request.delete(
      `/system/user/${params.id}`,
      {},
      {
        showSuccess: true,
        successMessage: '删除成功'
      }
    )
  },

  /**
   * 批量删除用户
   */
  batchDelete(ids: number[]) {
    return request.delete(
      '/system/user/batch',
      { ids },
      {
        showSuccess: true,
        successMessage: '批量删除成功'
      }
    )
  },

  /**
   * 重置密码
   */
  resetPassword(id: number, password: string) {
    return request.post(
      `/system/user/${id}/reset-password`,
      { password },
      {
        showSuccess: true,
        successMessage: '密码重置成功'
      }
    )
  },

  /**
   * 修改用户状态
   */
  changeStatus(id: number, status: number) {
    return request.put(
      `/system/user/${id}/status`,
      { status },
      {
        showSuccess: true,
        successMessage: '状态修改成功'
      }
    )
  },

  /**
   * 导出用户
   */
  export(params: UserQueryParams) {
    return request.download('/system/user/export', params, '用户列表.xlsx')
  }
}

import { request } from '@/utils/request'
import type { PageParams, PageResult, IdParam } from '../types'

/**
 * 角色信息
 */
export interface Role {
  id: number
  name: string
  code: string
  description?: string
  status: number
  createTime: string
  updateTime?: string
}

/**
 * 角色查询参数
 */
export interface RoleQueryParams extends PageParams {
  name?: string
  code?: string
  status?: number
}

/**
 * 角色创建/更新参数
 */
export interface RoleFormData {
  id?: number
  name: string
  code: string
  description?: string
  status: number
  menuIds?: number[]
  permissionIds?: number[]
}

/**
 * 角色管理 API
 */
export const roleApi = {
  /**
   * 获取角色列表
   */
  getList(params: RoleQueryParams) {
    return request.get<PageResult<Role>>('/system/role/list', params)
  },

  /**
   * 获取所有角色（不分页）
   */
  getAll() {
    return request.get<Role[]>('/system/role/all')
  },

  /**
   * 获取角色详情
   */
  getDetail(id: number) {
    return request.get<Role>(`/system/role/${id}`)
  },

  /**
   * 创建角色
   */
  create(data: RoleFormData) {
    return request.post('/system/role', data, {
      showSuccess: true,
      successMessage: '创建成功'
    })
  },

  /**
   * 更新角色
   */
  update(data: RoleFormData) {
    return request.put(`/system/role/${data.id}`, data, {
      showSuccess: true,
      successMessage: '更新成功'
    })
  },

  /**
   * 删除角色
   */
  delete(params: IdParam) {
    return request.delete(
      `/system/role/${params.id}`,
      {},
      {
        showSuccess: true,
        successMessage: '删除成功'
      }
    )
  },

  /**
   * 获取角色权限
   */
  getPermissions(id: number) {
    return request.get<number[]>(`/system/role/${id}/permissions`)
  },

  /**
   * 分配权限
   */
  assignPermissions(id: number, permissionIds: number[]) {
    return request.post(
      `/system/role/${id}/permissions`,
      { permissionIds },
      {
        showSuccess: true,
        successMessage: '权限分配成功'
      }
    )
  }
}

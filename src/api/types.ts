/**
 * API 通用类型定义
 */

/**
 * 分页请求参数
 */
export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

/**
 * 分页响应数据
 */
export interface PageResult<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 列表响应数据
 */
export interface ListResult<T = any> {
  list: T[]
}

/**
 * ID 参数
 */
export interface IdParam {
  id: number | string
}

/**
 * ID 列表参数
 */
export interface IdsParam {
  ids: (number | string)[]
}

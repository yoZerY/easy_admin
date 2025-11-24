import { useUserStore } from '@/stores/modules/user'

/**
 * 权限工具函数
 */

/**
 * 判断是否有权限
 * @param value 权限标识
 * @returns 是否有权限
 */
export function hasAuth(value: string | string[]): boolean {
  if (!value) return false

  const userStore = useUserStore()
  return userStore.hasPermission(value)
}

/**
 * 判断是否有角色
 * @param value 角色标识
 * @returns 是否有角色
 */
export function hasRole(value: string | string[]): boolean {
  if (!value) return false

  const userStore = useUserStore()
  return userStore.hasRole(value)
}

/**
 * 判断是否有权限（指令用）
 * @param el 元素
 * @param binding 绑定值
 */
export function checkAuth(el: HTMLElement, binding: { value: string | string[] }) {
  const { value } = binding

  if (value) {
    if (!hasAuth(value)) {
      el.parentNode?.removeChild(el)
    }
  } else {
    throw new Error('需要权限标识！如 v-auth="\'system:user:add\'"')
  }
}

/**
 * 判断是否有角色（指令用）
 * @param el 元素
 * @param binding 绑定值
 */
export function checkRole(el: HTMLElement, binding: { value: string | string[] }) {
  const { value } = binding

  if (value) {
    if (!hasRole(value)) {
      el.parentNode?.removeChild(el)
    }
  } else {
    throw new Error('需要角色标识！如 v-role="\'admin\'"')
  }
}

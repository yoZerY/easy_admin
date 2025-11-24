import type { Directive, DirectiveBinding } from 'vue'
import { checkAuth, checkRole } from '@/utils/auth'

/**
 * 权限指令
 * @example v-auth="'system:user:add'"
 * @example v-auth="['system:user:add', 'system:user:edit']"
 */
export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkAuth(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkAuth(el, binding)
  }
}

/**
 * 角色指令
 * @example v-role="'admin'"
 * @example v-role="['admin', 'user']"
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkRole(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkRole(el, binding)
  }
}

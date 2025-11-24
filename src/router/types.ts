import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由 meta 配置
 */
export interface RouteMeta {
  /** 菜单名称（兼容国际化、非国际化，如果用国际化，这里填对应的 key） */
  title?: string
  /** 菜单图标 */
  icon?: string
  /** 是否在菜单中显示（默认 true） */
  showLink?: boolean
  /** 是否显示父级菜单 */
  showParent?: boolean
  /** 菜单排序，值越高排的越后（只针对顶级路由） */
  rank?: number
  /** 路由组件缓存（开启 true、关闭 false、不设置不缓存） */
  keepAlive?: boolean
  /** 需要内嵌的iframe链接地址 */
  frameSrc?: string
  /** 内嵌的iframe页面是否开启首次加载动画（默认 true） */
  frameLoading?: boolean
  /** 页面加载动画（有两种形式，一种直接采用vue内置的transitions动画，另一种是使用animate.css写进、离场动画） */
  transition?: {
    /** 当前页面动画，这里填写 animate.css 的动画类名 */
    name?: string
    /** 进场动画 */
    enterTransition?: string
    /** 离场动画 */
    leaveTransition?: string
  }
  /** 是否不添加信息到标签页 */
  hiddenTag?: boolean
  /** 动态路由可打开的最大数量 */
  dynamicLevel?: number
  /** 将某个菜单激活（主要用于通过query或params传参的路由，当它们通过配置showLink: false后不在菜单中显示，就不会有任何菜单高亮，而通过设置activePath指定激活菜单即可获得高亮，activePath为指定激活菜单的path） */
  activePath?: string
  /** 是否固定在标签页 */
  fixedTag?: boolean
  /** 权限标识，用于判断是否有权限访问该路由 */
  roles?: Array<string>
  /** 按钮级别权限设置 */
  auths?: Array<string>
}

/**
 * 扩展 RouteRecordRaw
 */
export type RouteConfigsTable = {
  /** 路由地址 */
  path: string
  /** 路由名字（保持唯一） */
  name?: string
  /** 路由重定向 */
  redirect?: string
  /** 按需加载组件 */
  component?: any
  meta?: RouteMeta
  /** 子路由配置项 */
  children?: Array<RouteConfigsTable>
} & Omit<RouteRecordRaw, 'meta' | 'children'>

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    showLink?: boolean
    showParent?: boolean
    rank?: number
    keepAlive?: boolean
    frameSrc?: string
    frameLoading?: boolean
    transition?: {
      name?: string
      enterTransition?: string
      leaveTransition?: string
    }
    hiddenTag?: boolean
    dynamicLevel?: number
    activePath?: string
    fixedTag?: boolean
    roles?: Array<string>
    auths?: Array<string>
  }
}

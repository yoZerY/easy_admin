import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TagView {
  path: string
  name: string
  title: string
  icon?: string
  closable: boolean
  pinned?: boolean
  order?: number
}

export interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: string[]
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: []
  }),
  getters: {
    // 获取所有访问过的视图
    getVisitedViews: (state) => state.visitedViews,
    // 获取所有缓存的视图
    getCachedViews: (state) => state.cachedViews
  },
  actions: {
    // 添加访问的视图
    addView(route: RouteLocationNormalizedLoaded) {
      this.addVisitedView(route)
      this.addCachedView(route)
    },
    // 添加访问过的视图
    addVisitedView(route: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === route.path)) return

      const view: TagView = {
        path: route.path,
        name: route.name as string,
        title: (route.meta?.title as string) || 'no-name',
        icon: route.meta?.icon as string,
        closable: route.name !== 'Welcome' // 首页不可关闭
      }

      this.visitedViews.push(view)
    },
    // 添加缓存的视图
    addCachedView(route: RouteLocationNormalizedLoaded) {
      if (!route.name) return
      if (this.cachedViews.includes(route.name as string)) return
      if (route.meta?.noCache) return

      this.cachedViews.push(route.name as string)
    },
    // 删除视图
    delView(view: TagView) {
      this.delVisitedView(view)
      this.delCachedView(view)
    },
    // 删除访问过的视图
    delVisitedView(view: TagView) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      if (index > -1) {
        this.visitedViews.splice(index, 1)
      }
    },
    // 删除缓存的视图
    delCachedView(view: TagView) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
      }
    },
    // 删除其他视图
    delOthersViews(view: TagView) {
      this.visitedViews = this.visitedViews.filter((v) => v.path === view.path || !v.closable)
      this.cachedViews = this.cachedViews.filter((name) => name === view.name)
    },
    // 删除所有视图
    delAllViews() {
      this.visitedViews = this.visitedViews.filter((v) => !v.closable)
      this.cachedViews = []
    },
    // 删除左侧视图
    delLeftViews(view: TagView) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => i >= index || !v.closable)
      }
    },
    // 删除右侧视图
    delRightViews(view: TagView) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => i <= index || !v.closable)
      }
    },
    // 更新视图
    updateVisitedView(route: RouteLocationNormalizedLoaded) {
      const view = this.visitedViews.find((v) => v.path === route.path)
      if (view) {
        view.title = (route.meta?.title as string) || view.title
        view.icon = (route.meta?.icon as string) || view.icon
      }
    },
    // 固定标签
    pinView(view: TagView) {
      const target = this.visitedViews.find((v) => v.path === view.path)
      if (!target) return
      target.pinned = true
      // 将固定的标签移到前面
      this.sortViews()
    },
    // 取消固定标签
    unpinView(view: TagView) {
      const target = this.visitedViews.find((v) => v.path === view.path)
      if (!target) return
      target.pinned = false
      this.sortViews()
    },
    // 排序视图（固定的在前面）
    sortViews() {
      this.visitedViews.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return (a.order || 0) - (b.order || 0)
      })
    },
    // 重新排序标签
    reorderViews(fromIndex: number, toIndex: number) {
      const [removed] = this.visitedViews.splice(fromIndex, 1)
      if (removed) {
        this.visitedViews.splice(toIndex, 0, removed)
        // 更新 order
        this.visitedViews.forEach((view, index) => {
          view.order = index
        })
      }
    }
  },
  persist: {
    storage: sessionStorage
  }
})

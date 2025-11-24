import type { RouteRecordRaw } from 'vue-router'

// 自动导入所有路由模块
const modulesFiles = import.meta.glob<{ default: RouteRecordRaw }>('./modules/*.ts', {
  eager: true
})

const modules: RouteRecordRaw[] = []
for (const path in modulesFiles) {
  const module = modulesFiles[path]
  if (module?.default) {
    modules.push(module.default)
  }
}

// 按 rank 排序
const sortedModules = modules.sort((a, b) => {
  const rankA = (a.meta?.rank as number) ?? 999
  const rankB = (b.meta?.rank as number) ?? 999
  return rankA - rankB
})
console.log('sortedModules', sortedModules)
export const routes: RouteRecordRaw[] = [...sortedModules]

// 导出用于侧边栏的路由
export const menuRoutes = sortedModules

# 路由合并策略说明（更新版）

## 📋 合并策略

**核心原则**：以后端菜单为主，本地路由提供组件和子路由，主要做去重

## 🎯 关键改进

### ✅ 保留子路由

合并时会**自动保留本地路由的 children**，确保子菜单正常显示。

```typescript
if (localRoute.children && localRoute.children.length > 0) {
  mergedRoute.children = localRoute.children
  console.log(`  └─ 包含 ${localRoute.children.length} 个子路由`)
}
```

## 💻 完整代码

```typescript
export function mergeRoutesWithMenus(
  localRoutes: RouteRecordRaw[],
  backendMenus: MenuItem[]
): RouteRecordRaw[] {
  // 1. 创建本地路由映射
  const localRouteMap = new Map<string, RouteRecordRaw>()
  localRoutes.forEach((route) => {
    localRouteMap.set(route.path, route)
  })

  // 2. 去重 Set
  const addedPaths = new Set<string>()

  // 3. 遍历后端菜单
  const mergedRoutes: RouteRecordRaw[] = []

  backendMenus.forEach((menu) => {
    // 去重检查
    if (addedPaths.has(menu.path)) {
      return
    }

    const localRoute = localRouteMap.get(menu.path)

    if (localRoute) {
      // 情况 1：本地有对应路由
      const mergedRoute = {
        ...localRoute, // 使用本地的 component、redirect 等
        meta: {
          ...localRoute.meta, // 本地默认配置
          ...menu.meta // 后端配置覆盖
        }
      }

      // ✅ 保留本地路由的 children
      if (localRoute.children && localRoute.children.length > 0) {
        mergedRoute.children = localRoute.children
      }

      mergedRoutes.push(mergedRoute)
      addedPaths.add(menu.path)
    } else {
      // 情况 2：本地没有对应路由
      const newRoute = {
        path: menu.path,
        name: menu.name,
        meta: menu.meta,
        component: () => import(`@/views${menu.path}/index.vue`)
      }
      mergedRoutes.push(newRoute)
      addedPaths.add(menu.path)
    }
  })

  return mergedRoutes
}
```

## 📝 示例说明

### 示例：系统管理菜单（有子菜单）

**后端菜单**：

```json
{
  "path": "/system",
  "name": "System",
  "meta": {
    "title": "系统管理",
    "icon": "ri:settings-3-line",
    "rank": 2,
    "showLink": true
  }
}
```

**本地路由**：

```typescript
{
  path: '/system',
  name: 'System',
  component: Layout,
  redirect: '/system/user',
  meta: {
    title: 'System',
    icon: 'ri:settings-line',
    rank: 999
  },
  children: [
    {
      path: '/system/user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'ri:user-line'
      }
    },
    {
      path: '/system/role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: 'ri:admin-line'
      }
    }
  ]
}
```

**合并结果**：

```typescript
{
  path: '/system',
  name: 'System',
  component: Layout,              // ✅ 来自本地
  redirect: '/system/user',       // ✅ 来自本地
  meta: {
    title: '系统管理',            // ✅ 来自后端（覆盖）
    icon: 'ri:settings-3-line',   // ✅ 来自后端（覆盖）
    rank: 2,                      // ✅ 来自后端（覆盖）
    showLink: true                // ✅ 来自后端
  },
  children: [                     // ✅ 来自本地（保留）
    {
      path: '/system/user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'ri:user-line'
      }
    },
    {
      path: '/system/role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: 'ri:admin-line'
      }
    }
  ]
}
```

## 🎯 关键点

### 1. 后端菜单只需要返回顶级菜单

后端不需要返回子菜单，只需要返回顶级菜单即可：

```json
[
  { "path": "/", "name": "Home", "meta": {...} },
  { "path": "/system", "name": "System", "meta": {...} },
  { "path": "/data", "name": "Data", "meta": {...} }
]
```

### 2. 子菜单由本地路由提供

子菜单在本地路由的 `children` 中定义，合并时会自动保留：

```typescript
{
  path: '/system',
  children: [
    { path: '/system/user', ... },
    { path: '/system/role', ... },
    { path: '/system/menu', ... }
  ]
}
```

### 3. 子菜单的权限控制

子菜单的权限在本地路由的 meta 中定义：

```typescript
{
  path: '/system/user',
  meta: {
    roles: ['admin'],
    auths: ['system:user:list']
  }
}
```

## 🔍 调试日志

登录时控制台会输出：

```
🔄 开始合并路由...
📦 本地路由数量: 20
📋 后端菜单数量: 7
✅ 路由 / 合并成功（使用本地组件 + 后端配置）
✅ 路由 /system 合并成功（使用本地组件 + 后端配置）
  └─ 包含 4 个子路由
✅ 路由 /data 合并成功（使用本地组件 + 后端配置）
  └─ 包含 3 个子路由
✅ 路由合并完成，最终路由数量: 7
```

## 💡 最佳实践

### 1. 后端只返回顶级菜单

```json
// ✅ 推荐：只返回顶级菜单
[
  { "path": "/system", "name": "System", "meta": {...} }
]

// ❌ 不推荐：返回所有子菜单
[
  { "path": "/system", "name": "System", "meta": {...} },
  { "path": "/system/user", "name": "SystemUser", "meta": {...} },
  { "path": "/system/role", "name": "SystemRole", "meta": {...} }
]
```

### 2. 本地定义完整的路由树

```typescript
// ✅ 推荐：完整的路由树
{
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  children: [
    { path: '/system/user', component: UserView, meta: {...} },
    { path: '/system/role', component: RoleView, meta: {...} }
  ]
}
```

### 3. 子菜单权限在本地定义

```typescript
// ✅ 推荐：在本地路由中定义权限
children: [
  {
    path: '/system/user',
    meta: {
      roles: ['admin'],
      auths: ['system:user:list']
    }
  }
]
```

## 🎓 总结

通过**保留本地路由的 children**，实现了：

1. ✅ **后端控制顶级菜单**：显示哪些顶级菜单由后端决定
2. ✅ **本地提供子菜单**：子菜单在本地定义，自动保留
3. ✅ **配置灵活覆盖**：后端可以覆盖顶级菜单配置
4. ✅ **权限精确控制**：子菜单权限在本地定义
5. ✅ **自动去重**：防止重复菜单

这样既保证了灵活性，又保证了子菜单的正常显示！🎉

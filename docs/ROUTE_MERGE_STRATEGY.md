# 路由合并策略说明

## 📋 合并策略

**核心原则**：以后端菜单为主，本地路由提供组件，主要做去重

## 🎯 工作原理

### 1. 数据来源

- **后端菜单**：决定显示哪些菜单，以及菜单的配置（标题、图标、排序等）
- **本地路由**：提供路由组件和默认配置

### 2. 合并流程

```
┌─────────────────┐
│  后端菜单列表    │
│  [menu1, menu2]  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  遍历每个后端菜单            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  检查是否重复                │
│  (使用 Set 去重)             │
└────────┬────────────────────┘
         │
         ▼
    ┌───┴───┐
    │ 重复？ │
    └───┬───┘
        │
    ┌───┴───┐
    │  是   │──→ 跳过
    └───────┘
        │
    ┌───┴───┐
    │  否   │
    └───┬───┘
        │
        ▼
┌─────────────────────────────┐
│  查找本地路由                │
│  (根据 path 匹配)            │
└────────┬────────────────────┘
         │
         ▼
    ┌───┴───┐
    │ 找到？ │
    └───┬───┘
        │
    ┌───┴────────────┐
    │                │
    是               否
    │                │
    ▼                ▼
┌────────┐    ┌────────┐
│使用本地 │    │创建新  │
│组件 +   │    │路由    │
│后端配置 │    │        │
└────┬───┘    └───┬────┘
     │            │
     └────┬───────┘
          │
          ▼
┌─────────────────┐
│  添加到结果列表  │
└─────────────────┘
```

## 💻 代码实现

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
      mergedRoutes.push({
        ...localRoute, // 使用本地的 component
        meta: {
          ...localRoute.meta, // 本地默认配置
          ...menu.meta // 后端配置覆盖
        }
      })
    } else {
      // 情况 2：本地没有对应路由
      mergedRoutes.push({
        path: menu.path,
        name: menu.name,
        meta: menu.meta,
        component: () => import(`@/views${menu.path}/index.vue`)
      })
    }

    addedPaths.add(menu.path)
  })

  return mergedRoutes
}
```

## 📝 示例说明

### 示例 1：本地有对应路由

**后端菜单**：

```json
{
  "path": "/system",
  "name": "System",
  "meta": {
    "title": "系统管理",
    "icon": "ri:settings-3-line",
    "rank": 1,
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
  }
}
```

**合并结果**：

```typescript
{
  path: '/system',
  name: 'System',
  component: Layout,              // 来自本地
  redirect: '/system/user',       // 来自本地
  meta: {
    title: '系统管理',            // 来自后端（覆盖）
    icon: 'ri:settings-3-line',   // 来自后端（覆盖）
    rank: 1,                      // 来自后端（覆盖）
    showLink: true                // 来自后端
  }
}
```

### 示例 2：本地没有对应路由

**后端菜单**：

```json
{
  "path": "/custom",
  "name": "Custom",
  "meta": {
    "title": "自定义页面",
    "icon": "ri:custom-line",
    "rank": 10,
    "showLink": true
  }
}
```

**本地路由**：无

**合并结果**：

```typescript
{
  path: '/custom',
  name: 'Custom',
  meta: {
    title: '自定义页面',
    icon: 'ri:custom-line',
    rank: 10,
    showLink: true
  },
  component: () => import('@/views/custom/index.vue')  // 动态导入
}
```

### 示例 3：去重处理

**后端菜单**：

```json
[
  {
    "path": "/system",
    "name": "System",
    "meta": { "title": "系统管理" }
  },
  {
    "path": "/system", // 重复
    "name": "System2",
    "meta": { "title": "系统管理2" }
  }
]
```

**合并结果**：

```typescript
;[
  {
    path: '/system',
    name: 'System',
    meta: { title: '系统管理' }
  }
  // 第二个被去重，不会添加
]
```

## 🎯 优势

### 1. 灵活性高

- ✅ 后端可以完全控制菜单显示
- ✅ 后端可以动态调整菜单配置
- ✅ 后端可以添加新菜单（如果本地有对应组件）

### 2. 安全性好

- ✅ 前端组件在本地定义，不会被后端覆盖
- ✅ 后端只能控制菜单显示，不能注入恶意代码

### 3. 易于维护

- ✅ 前端专注于组件开发
- ✅ 后端专注于权限控制
- ✅ 职责分离清晰

### 4. 自动去重

- ✅ 防止后端返回重复菜单
- ✅ 确保路由唯一性

## 📊 对比

| 特性       | 以本地为主 | 以后端为主（当前） |
| ---------- | ---------- | ------------------ |
| 菜单控制   | 前端       | 后端 ✅            |
| 组件来源   | 前端       | 前端 ✅            |
| 配置优先级 | 本地       | 后端 ✅            |
| 动态性     | 低         | 高 ✅              |
| 灵活性     | 低         | 高 ✅              |
| 安全性     | 高         | 高 ✅              |

## 💡 最佳实践

### 1. 后端返回完整菜单配置

```json
{
  "path": "/system",
  "name": "System",
  "meta": {
    "title": "系统管理", // 必须
    "icon": "ri:settings-3-line", // 必须
    "rank": 1, // 必须
    "showLink": true // 必须
  }
}
```

### 2. 本地定义完整路由

```typescript
{
  path: '/system',
  name: 'System',
  component: Layout,        // 必须
  redirect: '/system/user', // 可选
  meta: {
    title: 'System',        // 默认值
    icon: 'ri:settings-line', // 默认值
    rank: 999,              // 默认值
    roles: ['admin'],       // 权限配置
    auths: ['system:view']  // 权限配置
  },
  children: [...]           // 子路由
}
```

### 3. 权限配置在本地

```typescript
// ✅ 推荐：权限配置在本地路由
meta: {
  roles: ['admin'],
  auths: ['system:view']
}

// ❌ 不推荐：权限配置在后端菜单
// 权限应该在前端代码中定义，后端只返回用户可访问的菜单
```

## 🔍 调试技巧

### 查看合并过程

打开浏览器控制台，登录时会输出详细日志：

```
🔄 开始合并路由...
📦 本地路由数量: 20
📋 后端菜单数量: 7
✅ 路由 / 合并成功（使用本地组件 + 后端配置）
✅ 路由 /system 合并成功（使用本地组件 + 后端配置）
✅ 路由 /custom 创建成功（使用后端配置）
⚠️ 菜单 /duplicate 重复，已跳过
✅ 路由合并完成，最终路由数量: 7
```

### 查看合并结果

```javascript
import { useRouterStore } from '@/stores/modules/router'

const routerStore = useRouterStore()
console.log('合并后的路由:', routerStore.getMergedRoutes)
```

## 🎓 总结

通过**以后端为主 + 去重**的合并策略，实现了：

1. ✅ **后端完全控制菜单**：显示哪些菜单由后端决定
2. ✅ **前端提供组件**：组件在本地定义，安全可控
3. ✅ **配置灵活覆盖**：后端可以覆盖菜单配置
4. ✅ **自动去重**：防止重复菜单
5. ✅ **职责分离**：前端负责组件，后端负责权限

这种策略既保证了灵活性，又保证了安全性！🎉

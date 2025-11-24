# RBAC 权限管理最佳实践指南

## 📋 目录

- [系统架构](#系统架构)
- [核心概念](#核心概念)
- [使用指南](#使用指南)
- [最佳实践](#最佳实践)
- [API 文档](#api-文档)

## 🏗️ 系统架构

### 权限模型

```
用户 (User) → 角色 (Role) → 权限 (Permission)
```

- **用户 (User)**: 系统使用者
- **角色 (Role)**: 用户的身份标识，如 `admin`、`user`、`editor`
- **权限 (Permission)**: 具体的操作权限，如 `system:user:add`、`system:user:edit`

### 权限格式

采用三段式权限标识：`模块:资源:操作`

```typescript
// 示例
'system:user:list' // 系统管理 - 用户管理 - 查看列表
'system:user:add' // 系统管理 - 用户管理 - 新增
'system:user:edit' // 系统管理 - 用户管理 - 编辑
'system:user:delete' // 系统管理 - 用户管理 - 删除
'system:role:*' // 系统管理 - 角色管理 - 所有操作
'*:*:*' // 超级管理员 - 所有权限
```

## 🎯 核心概念

### 1. 用户 Store

位置：`src/stores/modules/user.ts`

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  roles: string[] // 角色列表
  permissions: string[] // 权限列表
}
```

### 2. 权限工具函数

位置：`src/utils/auth.ts`

```typescript
// 检查权限
hasAuth('system:user:add')
hasAuth(['system:user:add', 'system:user:edit'])

// 检查角色
hasRole('admin')
hasRole(['admin', 'editor'])
```

### 3. 路由守卫

位置：`src/router/guard.ts`

- 登录验证
- 权限验证
- 路由权限检查
- 标签页管理

## 📖 使用指南

### 1. 路由级权限控制

在路由配置中添加 `meta.roles` 或 `meta.auths`：

```typescript
// src/router/routes/modules/system.ts
{
  path: '/system/user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    icon: 'ri:user-line',
    roles: ['admin'],                    // 需要 admin 角色
    auths: ['system:user:list']          // 需要查看权限
  }
}
```

**权限判断逻辑**：

- 如果配置了 `roles`，用户必须拥有其中任意一个角色
- 如果配置了 `auths`，用户必须拥有其中任意一个权限
- 两者都配置时，必须同时满足

### 2. 菜单级权限控制

菜单会自动根据路由权限过滤，无需额外配置。

```typescript
// 自动过滤逻辑在 SidebarItem 组件中
const hasPermission = computed(() => {
  const { meta } = props.item

  if (!meta?.roles && !meta?.auths) return true
  if (meta.roles && !hasRole(meta.roles)) return false
  if (meta.auths && !hasAuth(meta.auths)) return false

  return true
})
```

### 3. 按钮级权限控制

使用 `v-auth` 或 `v-role` 指令：

```vue
<template>
  <!-- 权限指令 -->
  <el-button v-auth="'system:user:add'" type="primary"> 新增用户 </el-button>

  <!-- 角色指令 -->
  <el-button v-role="'admin'" type="danger"> 删除用户 </el-button>

  <!-- 多个权限（满足任意一个） -->
  <el-button v-auth="['system:user:edit', 'system:user:delete']"> 编辑或删除 </el-button>
</template>
```

### 4. 代码中权限判断

```vue
<script setup lang="ts">
import { hasAuth, hasRole } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// 方式 1: 使用工具函数
if (hasAuth('system:user:add')) {
  // 有权限
}

if (hasRole('admin')) {
  // 是管理员
}

// 方式 2: 使用 store 方法
if (userStore.hasPermission('system:user:add')) {
  // 有权限
}

if (userStore.hasRole('admin')) {
  // 是管理员
}

// 方式 3: 使用计算属性
const canAdd = computed(() => hasAuth('system:user:add'))
const isAdmin = computed(() => hasRole('admin'))
</script>
```

### 5. 条件渲染

```vue
<template>
  <!-- 使用 v-if -->
  <el-button v-if="hasAuth('system:user:add')" type="primary"> 新增用户 </el-button>

  <!-- 使用计算属性 -->
  <el-button v-if="canAdd" type="primary"> 新增用户 </el-button>

  <!-- 复杂权限判断 -->
  <div v-if="isAdmin || hasAuth('system:user:edit')">管理员或有编辑权限才能看到</div>
</template>

<script setup lang="ts">
import { hasAuth, hasRole } from '@/utils/auth'

const canAdd = computed(() => hasAuth('system:user:add'))
const isAdmin = computed(() => hasRole('admin'))
</script>
```

## 🎨 最佳实践

### 1. 权限命名规范

```typescript
// ✅ 推荐：三段式命名
'system:user:list'
'system:user:add'
'system:user:edit'
'system:user:delete'
'system:role:*'

// ❌ 不推荐：不规范的命名
'userList'
'add_user'
'user-edit'
```

### 2. 角色设计

```typescript
// 角色层级
const ROLES = {
  SUPER_ADMIN: 'admin', // 超级管理员（所有权限）
  ADMIN: 'manager', // 管理员（大部分权限）
  EDITOR: 'editor', // 编辑（内容管理权限）
  USER: 'user' // 普通用户（基础权限）
}

// 角色权限映射（后端维护）
const ROLE_PERMISSIONS = {
  admin: ['*:*:*'],
  manager: ['system:*:*', 'data:*:*'],
  editor: ['data:*:list', 'data:*:edit'],
  user: ['data:*:list']
}
```

### 3. 权限粒度

```typescript
// ✅ 推荐：合理的权限粒度
'system:user:list' // 查看用户列表
'system:user:detail' // 查看用户详情
'system:user:add' // 新增用户
'system:user:edit' // 编辑用户
'system:user:delete' // 删除用户
'system:user:export' // 导出用户

// ❌ 不推荐：粒度过细
'system:user:list:page1'
'system:user:edit:name'
'system:user:edit:email'
```

### 4. 前后端权限一致性

```typescript
// 前端路由权限
{
  path: '/system/user',
  meta: {
    auths: ['system:user:list']
  }
}

// 后端接口权限（示例）
@RequirePermission('system:user:list')
async getUserList() {
  // ...
}
```

### 5. 权限缓存策略

```typescript
// 用户信息持久化
export const useUserStore = defineStore('user', {
  // ...
  persist: {
    storage: localStorage,
    paths: ['token', 'userInfo', 'roles', 'permissions']
  }
})

// 刷新页面时自动恢复权限
router.beforeEach(async (to, from, next) => {
  if (userStore.getIsLogin && !userStore.getUserInfo) {
    await userStore.getUserInfoFromServer()
  }
  next()
})
```

### 6. 动态路由（可选）

```typescript
// 根据用户权限动态生成路由
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]) {
  const res: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
```

## 📚 API 文档

### User Store

#### State

```typescript
interface UserState {
  token: string // 登录令牌
  userInfo: UserInfo | null // 用户信息
  roles: string[] // 角色列表
  permissions: string[] // 权限列表
  isLogin: boolean // 是否已登录
}
```

#### Getters

```typescript
getUserInfo: UserInfo | null       // 获取用户信息
getRoles: string[]                 // 获取角色列表
getPermissions: string[]           // 获取权限列表
isSuperAdmin: boolean              // 是否超级管理员
getIsLogin: boolean                // 是否已登录
```

#### Actions

```typescript
// 设置 Token
setToken(token: string): void

// 设置用户信息
setUserInfo(userInfo: UserInfo): void

// 登录
login(username: string, password: string): Promise<Result>

// 获取用户信息
getUserInfoFromServer(): Promise<Result>

// 登出
logout(): Promise<Result>

// 检查权限
hasPermission(permission: string | string[]): boolean

// 检查角色
hasRole(role: string | string[]): boolean

// 检查路由权限
hasRoutePermission(route: RouteRecordRaw): boolean
```

### 权限工具函数

```typescript
// 检查权限
hasAuth(value: string | string[]): boolean

// 检查角色
hasRole(value: string | string[]): boolean

// 权限指令（用于 DOM 元素）
checkAuth(el: HTMLElement, binding: { value: string | string[] }): void

// 角色指令（用于 DOM 元素）
checkRole(el: HTMLElement, binding: { value: string | string[] }): void
```

### 路由 Meta 配置

```typescript
interface RouteMeta {
  title?: string // 页面标题
  icon?: string // 菜单图标
  roles?: string[] // 角色权限
  auths?: string[] // 操作权限
  hiddenTag?: boolean // 是否隐藏标签页
  showLink?: boolean // 是否在菜单中显示
  showParent?: boolean // 是否显示父级菜单
  rank?: number // 排序
}
```

## 🔒 安全建议

### 1. 前端权限只是 UI 控制

前端权限控制只能隐藏 UI 元素，不能真正阻止用户访问。**后端必须进行权限验证**。

### 2. 敏感操作二次确认

```vue
<el-button v-auth="'system:user:delete'" @click="handleDelete">
  删除
</el-button>

<script setup>
const handleDelete = async () => {
  await ElMessageBox.confirm('确定要删除吗？', '警告', {
    type: 'warning'
  })
  // 执行删除
}
</script>
```

### 3. Token 安全

```typescript
// ✅ 推荐：使用 HttpOnly Cookie（后端设置）
// ✅ 推荐：Token 设置过期时间
// ✅ 推荐：刷新 Token 机制
// ❌ 不推荐：Token 存储在 localStorage（XSS 风险）
```

### 4. 权限变更实时生效

```typescript
// 用户权限变更后，强制重新登录
watch(
  () => userStore.permissions,
  () => {
    ElMessage.warning('权限已变更，请重新登录')
    userStore.logout()
    router.push('/login')
  }
)
```

## 🚀 快速开始

### 1. 登录获取权限

```typescript
// 用户登录
const result = await userStore.login('admin', 'admin')

// 登录成功后，用户信息会自动保存
console.log(userStore.roles) // ['admin']
console.log(userStore.permissions) // ['*:*:*']
```

### 2. 配置路由权限

```typescript
{
  path: '/system/user',
  meta: {
    roles: ['admin'],
    auths: ['system:user:list']
  }
}
```

### 3. 使用权限指令

```vue
<el-button v-auth="'system:user:add'">新增</el-button>
```

### 4. 代码中判断权限

```typescript
if (hasAuth('system:user:add')) {
  // 执行操作
}
```

## 📝 示例代码

### 完整的用户管理页面

```vue
<template>
  <div class="user-container">
    <!-- 搜索表单 -->
    <PlusSearch v-model="searchForm" :columns="searchColumns" />

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button v-auth="'system:user:add'" type="primary" @click="handleAdd"> 新增用户 </el-button>
      <el-button v-auth="'system:user:export'" @click="handleExport"> 导出 </el-button>
    </div>

    <!-- 表格 -->
    <PlusTable :data="tableData" :columns="tableColumns">
      <template #operation="{ row }">
        <el-button v-auth="'system:user:edit'" link @click="handleEdit(row)"> 编辑 </el-button>
        <el-button v-auth="'system:user:delete'" link type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </PlusTable>
  </div>
</template>

<script setup lang="ts">
import { hasAuth } from '@/utils/auth'

// 检查权限
const canAdd = computed(() => hasAuth('system:user:add'))
const canEdit = computed(() => hasAuth('system:user:edit'))
const canDelete = computed(() => hasAuth('system:user:delete'))

// 操作方法
const handleAdd = () => {
  if (!canAdd.value) {
    ElMessage.warning('没有新增权限')
    return
  }
  // 执行新增
}
</script>
```

## 🎓 总结

RBAC 权限管理的核心是：

1. **用户 → 角色 → 权限** 的三层模型
2. **前端控制 UI，后端控制数据** 的安全原则
3. **路由级、菜单级、按钮级** 的多层权限控制
4. **统一的权限命名规范** 和 **清晰的角色设计**

遵循这些最佳实践，可以构建一个安全、灵活、易维护的权限管理系统。

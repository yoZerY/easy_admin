# RBAC 快速开始

## 🚀 已完成的功能

### 1. 核心模块

- ✅ **用户 Store** (`src/stores/modules/user.ts`)
  - 用户信息管理
  - 角色和权限管理
  - 登录/登出功能
  - 权限判断方法

- ✅ **权限工具** (`src/utils/auth.ts`)
  - `hasAuth()` - 检查操作权限
  - `hasRole()` - 检查角色权限
  - `checkAuth()` - 权限指令
  - `checkRole()` - 角色指令

- ✅ **路由守卫** (`src/router/guard.ts`)
  - 登录验证
  - 权限验证
  - 自动跳转
  - 标签页管理

### 2. 页面组件

- ✅ **登录页** (`src/views/login/index.vue`)
- ✅ **403 无权限页** (`src/views/error/403.vue`)
- ✅ **404 页面不存在** (`src/views/error/404.vue`)
- ✅ **权限演示页** (`src/views/demo/permission.vue`)

### 3. 路由配置

- ✅ 登录路由 (`/login`)
- ✅ 错误页面路由 (`/403`, `/404`)
- ✅ 权限演示路由 (`/components/permission`)

## 📝 使用方法

### 1. 访问系统

1. 启动开发服务器（已启动）：`http://localhost:5174/`
2. 系统会自动跳转到登录页
3. 使用默认账号登录：
   - 用户名：`admin`
   - 密码：`admin`（任意密码都可以）

### 2. 查看权限演示

登录后访问：**组件示例 → 权限演示**

演示内容包括：

- 当前用户信息（角色、权限）
- 角色权限控制示例
- 操作权限控制示例
- 代码中判断权限示例
- 权限测试工具

### 3. 在路由中使用权限

```typescript
// src/router/routes/modules/system.ts
{
  path: '/system/user',
  name: 'SystemUser',
  meta: {
    title: '用户管理',
    roles: ['admin'],                    // 需要 admin 角色
    auths: ['system:user:list']          // 需要查看权限
  }
}
```

### 4. 在模板中使用权限

```vue
<template>
  <!-- 使用指令 -->
  <el-button v-auth="'system:user:add'">新增</el-button>
  <el-button v-role="'admin'">管理员操作</el-button>

  <!-- 使用 v-if -->
  <el-button v-if="hasAuth('system:user:edit')">编辑</el-button>
  <el-button v-if="hasRole('admin')">删除</el-button>
</template>

<script setup>
import { hasAuth, hasRole } from '@/utils/auth'
</script>
```

### 5. 在代码中使用权限

```typescript
import { hasAuth, hasRole } from '@/utils/auth'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// 方式 1: 使用工具函数
if (hasAuth('system:user:add')) {
  // 执行操作
}

// 方式 2: 使用 store
if (userStore.hasPermission('system:user:add')) {
  // 执行操作
}

// 方式 3: 使用计算属性
const canAdd = computed(() => hasAuth('system:user:add'))
```

## 🎯 权限配置

### 当前默认权限

登录后默认获得：

- **角色**: `['admin']`
- **权限**: `['*:*:*']` (超级管理员，所有权限)

### 修改权限

编辑 `src/stores/modules/user.ts` 中的 `login` 方法：

```typescript
async login(username: string) {
  // 模拟不同用户的权限
  let mockUserInfo: UserInfo

  if (username === 'admin') {
    // 超级管理员
    mockUserInfo = {
      id: 1,
      username: 'admin',
      nickname: '超级管理员',
      roles: ['admin'],
      permissions: ['*:*:*']
    }
  } else if (username === 'user') {
    // 普通用户
    mockUserInfo = {
      id: 2,
      username: 'user',
      nickname: '普通用户',
      roles: ['user'],
      permissions: ['system:user:list']  // 只有查看权限
    }
  }

  this.setUserInfo(mockUserInfo)
}
```

## 🔧 自定义配置

### 1. 修改白名单

编辑 `src/router/guard.ts`：

```typescript
const WHITE_LIST = ['/login', '/404', '/403', '/register']
```

### 2. 添加新的权限标识

在路由配置中添加：

```typescript
{
  path: '/custom',
  meta: {
    auths: ['custom:module:action']
  }
}
```

### 3. 自定义权限判断逻辑

编辑 `src/stores/modules/user.ts` 中的 `hasPermission` 方法。

## 📚 相关文档

- 详细文档：`RBAC_GUIDE.md`
- 路由配置：`src/router/routes/modules/`
- 权限工具：`src/utils/auth.ts`
- 用户 Store：`src/stores/modules/user.ts`

## 🎉 测试步骤

1. **测试登录**
   - 访问 `http://localhost:5174/`
   - 输入用户名密码登录

2. **测试权限控制**
   - 访问 "组件示例 → 权限演示"
   - 查看不同权限的按钮显示

3. **测试路由权限**
   - 修改路由配置添加权限要求
   - 尝试访问受限页面

4. **测试退出登录**
   - 点击退出登录
   - 验证是否跳转到登录页

## 💡 提示

- 当前是模拟登录，实际项目需要对接后端 API
- 权限数据存储在 localStorage，刷新页面不会丢失
- 可以在浏览器控制台查看权限信息：`localStorage.getItem('__easy_admin__user__')`

## 🔗 下一步

1. 对接后端登录 API
2. 实现动态路由（根据权限生成路由）
3. 添加更多角色和权限
4. 实现权限管理页面（CRUD）

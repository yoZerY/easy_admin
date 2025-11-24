# 登录流程实现指南

## 📋 概述

本系统实现了完整的登录流程，包括：

1. 登录接口 → 返回 accessToken 和 refreshToken
2. 获取用户信息接口 → 返回用户信息和权限
3. 获取用户菜单接口 → 返回当前用户可访问的菜单

## 🔄 登录流程

```
┌─────────────┐
│  用户登录    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ 1. 调用登录接口              │
│    POST /auth/login          │
│    { username, password }    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ 返回 Token                   │
│ {                            │
│   accessToken,               │
│   refreshToken,              │
│   expiresIn                  │
│ }                            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ 2. 获取用户信息              │
│    GET /auth/userinfo        │
│    Header: Authorization     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ 返回用户信息                 │
│ {                            │
│   id, username, nickname,    │
│   roles, permissions         │
│ }                            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ 3. 获取用户菜单              │
│    GET /auth/menus           │
│    Header: Authorization     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ 返回菜单列表                 │
│ [                            │
│   { path, name, meta }       │
│ ]                            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│  登录完成    │
└─────────────┘
```

## 📁 文件结构

```
src/
├── mock/
│   ├── data.ts              # Mock 数据（用户、菜单）
│   └── api.ts               # Mock API 接口
├── stores/
│   └── modules/
│       ├── user.ts          # 用户状态管理
│       └── menu.ts          # 菜单状态管理
├── api/
│   └── modules/
│       └── auth.ts          # 认证 API（对接真实后端时使用）
└── views/
    ├── login/
    │   └── index.vue        # 登录页面
    └── demo/
        └── login-flow.vue   # 登录流程演示页面
```

## 🔑 Mock 数据

### 测试账号

| 用户名 | 密码   | 角色   | 权限              | 菜单数量 |
| ------ | ------ | ------ | ----------------- | -------- |
| admin  | admin  | admin  | _:_:\* (所有权限) | 7 个     |
| user   | user   | user   | 基础权限          | 4 个     |
| editor | editor | editor | 编辑权限          | 5 个     |

### 数据结构

```typescript
// 用户数据
{
  username: 'admin',
  password: 'admin',
  userInfo: {
    id: 1,
    username: 'admin',
    nickname: '超级管理员',
    avatar: 'https://...',
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    permissions: ['*:*:*']
  }
}

// 菜单数据
{
  path: '/',
  name: 'Home',
  meta: {
    icon: 'ri:home-4-line',
    title: '首页',
    rank: 1,
    showLink: true
  }
}
```

## 🚀 使用方法

### 1. 登录

```typescript
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// 登录
const result = await userStore.login('admin', 'admin')

if (result.success) {
  console.log('登录成功')
  console.log('Token:', userStore.token)
  console.log('用户信息:', userStore.userInfo)
  console.log('角色:', userStore.roles)
  console.log('权限:', userStore.permissions)
}
```

### 2. 获取菜单

```typescript
import { useMenuStore } from '@/stores/modules/menu'

const menuStore = useMenuStore()

// 获取菜单列表
const menus = menuStore.getMenus
console.log('菜单:', menus)
```

### 3. 权限判断

```typescript
import { hasAuth, hasRole } from '@/utils/auth'

// 检查权限
if (hasAuth('system:user:add')) {
  // 有权限
}

// 检查角色
if (hasRole('admin')) {
  // 是管理员
}
```

### 4. 登出

```typescript
await userStore.logout()
```

## 📝 API 接口

### 1. 登录接口

```typescript
// Mock 实现
export async function mockLogin(username: string, password: string) {
  // 验证用户名密码
  const user = mockUsers.find((u) => u.username === username && u.password === password)

  if (!user) {
    throw new Error('用户名或密码错误')
  }

  // 生成 Token
  const accessToken = generateToken(username)
  const refreshToken = generateToken(`${username}_refresh`)

  return {
    code: 200,
    message: '登录成功',
    success: true,
    data: {
      accessToken,
      refreshToken,
      expiresIn: 7200 // 2小时
    }
  }
}
```

### 2. 获取用户信息接口

```typescript
export async function mockGetUserInfo(token: string) {
  // 验证 Token
  const tokenData = tokenStore.get(token)
  if (!tokenData) {
    throw new Error('Token 无效或已过期')
  }

  // 查找用户信息
  const user = mockUsers.find((u) => u.username === tokenData.username)

  return {
    code: 200,
    message: '获取成功',
    success: true,
    data: user.userInfo
  }
}
```

### 3. 获取用户菜单接口

```typescript
export async function mockGetUserMenus(token: string) {
  // 验证 Token
  const tokenData = tokenStore.get(token)

  // 根据角色获取菜单
  const user = mockUsers.find((u) => u.username === tokenData.username)
  const menus = getMenusByRoles(user.userInfo.roles)

  return {
    code: 200,
    message: '获取成功',
    success: true,
    data: menus
  }
}
```

## 🔧 对接真实后端

### 1. 修改 API 配置

```typescript
// src/api/modules/auth.ts
export const authApi = {
  // 登录
  login(data: LoginParams) {
    return request.post<LoginResult>('/auth/login', data)
  },

  // 获取用户信息
  getUserInfo() {
    return request.get<UserInfo>('/auth/userinfo')
  },

  // 获取用户菜单
  getUserMenus() {
    return request.get<MenuItem[]>('/auth/menus')
  }
}
```

### 2. 修改 User Store

```typescript
// src/stores/modules/user.ts
import { authApi } from '@/api/modules/auth'

async login(username: string, password: string) {
  // 1. 调用真实登录接口
  const loginRes = await authApi.login({ username, password })
  const { accessToken, refreshToken } = loginRes

  this.token = accessToken
  this.refreshToken = refreshToken

  // 2. 获取用户信息
  const userInfo = await authApi.getUserInfo()
  this.setUserInfo(userInfo)

  // 3. 获取用户菜单
  const menus = await authApi.getUserMenus()
  menuStore.setMenus(menus)
}
```

### 3. 配置代理

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 💡 最佳实践

### 1. Token 管理

```typescript
// 自动添加 Token 到请求头
service.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})
```

### 2. Token 过期处理

```typescript
// 响应拦截器
service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，跳转登录
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

### 3. 刷新 Token

```typescript
async refreshToken() {
  const result = await authApi.refreshToken(this.refreshToken)
  this.token = result.accessToken
  this.refreshToken = result.refreshToken
}
```

### 4. 持久化存储

```typescript
// User Store 自动持久化
export const useUserStore = defineStore('user', {
  // ...
  persist: true // 自动保存到 localStorage
})
```

## 🎯 演示页面

访问 **组件示例 → 登录流程演示** 查看完整的登录流程演示。

功能包括：

- ✅ 快速登录（三种测试账号）
- ✅ 查看登录状态
- ✅ 查看 Token 信息
- ✅ 查看用户信息和权限
- ✅ 查看用户菜单
- ✅ 登录日志记录
- ✅ 退出登录

## 📊 登录流程时序图

```
用户          前端          Mock API        Store
 │             │              │              │
 │  输入账号密码 │              │              │
 │─────────────>│              │              │
 │             │              │              │
 │             │  调用登录接口  │              │
 │             │─────────────>│              │
 │             │              │              │
 │             │  返回 Token   │              │
 │             │<─────────────│              │
 │             │              │              │
 │             │  保存 Token   │              │
 │             │──────────────────────────────>│
 │             │              │              │
 │             │  获取用户信息  │              │
 │             │─────────────>│              │
 │             │              │              │
 │             │  返回用户信息  │              │
 │             │<─────────────│              │
 │             │              │              │
 │             │  保存用户信息  │              │
 │             │──────────────────────────────>│
 │             │              │              │
 │             │  获取用户菜单  │              │
 │             │─────────────>│              │
 │             │              │              │
 │             │  返回菜单列表  │              │
 │             │<─────────────│              │
 │             │              │              │
 │             │  保存菜单     │              │
 │             │──────────────────────────────>│
 │             │              │              │
 │  登录成功    │              │              │
 │<─────────────│              │              │
```

## 🔒 安全建议

1. **Token 存储**
   - 使用 HttpOnly Cookie（推荐）
   - 或使用 localStorage（需注意 XSS 风险）

2. **Token 过期**
   - 设置合理的过期时间
   - 实现自动刷新机制

3. **密码安全**
   - 前端不存储密码
   - 使用 HTTPS 传输

4. **权限验证**
   - 前端权限只是 UI 控制
   - 后端必须进行权限验证

## 📚 相关文件

- Mock 数据：`src/mock/data.ts`
- Mock API：`src/mock/api.ts`
- User Store：`src/stores/modules/user.ts`
- Menu Store：`src/stores/modules/menu.ts`
- 登录页面：`src/views/login/index.vue`
- 演示页面：`src/views/demo/login-flow.vue`

## 🎓 总结

通过这套登录流程实现，你可以：

1. ✅ 完整的登录流程（Token → 用户信息 → 菜单）
2. ✅ 动态菜单展示
3. ✅ 权限控制
4. ✅ Token 管理
5. ✅ 易于对接真实后端

现在可以访问登录页面或演示页面测试完整的登录流程！

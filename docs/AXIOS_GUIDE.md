# Axios 封装使用指南

## 📋 目录

- [功能特性](#功能特性)
- [目录结构](#目录结构)
- [基础使用](#基础使用)
- [API 模块化](#api-模块化)
- [请求配置](#请求配置)
- [错误处理](#错误处理)
- [最佳实践](#最佳实践)

## ✨ 功能特性

### 1. 核心功能

- ✅ 统一的请求/响应拦截
- ✅ 自动添加 Token
- ✅ 统一错误处理
- ✅ Loading 加载状态
- ✅ 请求超时处理
- ✅ 请求取消
- ✅ 文件上传/下载
- ✅ 环境变量配置
- ✅ 代理配置

### 2. 拦截器功能

**请求拦截器**：

- 自动添加 Token
- 显示 Loading
- 添加时间戳防缓存

**响应拦截器**：

- 统一处理业务状态码
- 自动显示成功/错误提示
- HTTP 状态码处理
- 401 自动跳转登录
- 403 自动跳转无权限页

## 📁 目录结构

```
src/
├── api/
│   ├── index.ts              # API 统一导出
│   ├── types.ts              # 通用类型定义
│   └── modules/
│       ├── auth.ts           # 认证相关 API
│       ├── user.ts           # 用户管理 API
│       └── role.ts           # 角色管理 API
├── utils/
│   └── request.ts            # Axios 封装
└── .env.development          # 开发环境配置
```

## 🚀 基础使用

### 1. 导入 request

```typescript
import { request } from '@/utils/request'
```

### 2. 发起请求

```typescript
// GET 请求
const data = await request.get('/api/users', { page: 1, pageSize: 10 })

// POST 请求
const result = await request.post('/api/users', { name: 'John' })

// PUT 请求
const updated = await request.put('/api/users/1', { name: 'Jane' })

// DELETE 请求
await request.delete('/api/users/1')
```

### 3. 使用配置

```typescript
// 显示 Loading
await request.get(
  '/api/users',
  {},
  {
    showLoading: true
  }
)

// 显示成功提示
await request.post('/api/users', data, {
  showSuccess: true,
  successMessage: '创建成功'
})

// 不显示错误提示
await request.get(
  '/api/users',
  {},
  {
    showError: false
  }
)
```

## 📦 API 模块化

### 1. 定义 API 模块

```typescript
// src/api/modules/user.ts
import { request } from '@/utils/request'
import type { PageParams, PageResult } from '../types'

export interface User {
  id: number
  username: string
  nickname: string
}

export const userApi = {
  // 获取列表
  getList(params: PageParams) {
    return request.get<PageResult<User>>('/system/user/list', params)
  },

  // 获取详情
  getDetail(id: number) {
    return request.get<User>(`/system/user/${id}`)
  },

  // 创建
  create(data: Partial<User>) {
    return request.post('/system/user', data, {
      showSuccess: true,
      successMessage: '创建成功'
    })
  },

  // 更新
  update(id: number, data: Partial<User>) {
    return request.put(`/system/user/${id}`, data, {
      showSuccess: true,
      successMessage: '更新成功'
    })
  },

  // 删除
  delete(id: number) {
    return request.delete(
      `/system/user/${id}`,
      {},
      {
        showSuccess: true,
        successMessage: '删除成功'
      }
    )
  }
}
```

### 2. 统一导出

```typescript
// src/api/index.ts
import { authApi } from './modules/auth'
import { userApi } from './modules/user'
import { roleApi } from './modules/role'

export const api = {
  auth: authApi,
  user: userApi,
  role: roleApi
}

export default api
```

### 3. 在组件中使用

```vue
<script setup lang="ts">
import { api } from '@/api'

// 获取用户列表
const getUserList = async () => {
  try {
    const data = await api.user.getList({
      page: 1,
      pageSize: 10
    })
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

// 创建用户
const createUser = async () => {
  await api.user.create({
    username: 'john',
    nickname: 'John Doe'
  })
}

// 更新用户
const updateUser = async (id: number) => {
  await api.user.update(id, {
    nickname: 'Jane Doe'
  })
}

// 删除用户
const deleteUser = async (id: number) => {
  await api.user.delete(id)
}
</script>
```

## ⚙️ 请求配置

### RequestConfig 接口

```typescript
interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean // 是否显示 loading，默认 true
  showError?: boolean // 是否显示错误提示，默认 true
  showSuccess?: boolean // 是否显示成功提示，默认 false
  successMessage?: string // 成功提示文案
}
```

### 使用示例

```typescript
// 1. 不显示 Loading
await request.get(
  '/api/users',
  {},
  {
    showLoading: false
  }
)

// 2. 显示成功提示
await request.post('/api/users', data, {
  showSuccess: true,
  successMessage: '用户创建成功'
})

// 3. 不显示错误提示
await request.get(
  '/api/users',
  {},
  {
    showError: false
  }
)

// 4. 自定义超时时间
await request.get(
  '/api/users',
  {},
  {
    timeout: 30000 // 30秒
  }
)

// 5. 自定义请求头
await request.post('/api/users', data, {
  headers: {
    'Custom-Header': 'value'
  }
})
```

## 🎯 特殊功能

### 1. 文件上传

```typescript
// 单文件上传
const file = document.querySelector('input[type="file"]').files[0]
const result = await request.upload('/api/upload', file)

// 多文件上传
const files = document.querySelector('input[type="file"]').files
const formData = new FormData()
Array.from(files).forEach((file) => {
  formData.append('files', file)
})
const result = await request.post('/api/upload/multiple', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

### 2. 文件下载

```typescript
// 下载文件
await request.download('/api/export', { type: 'excel' }, '用户列表.xlsx')

// 在 API 模块中使用
export const userApi = {
  export(params: any) {
    return request.download('/system/user/export', params, '用户列表.xlsx')
  }
}
```

### 3. 取消请求

```typescript
import axios from 'axios'

const controller = new AbortController()

// 发起请求
request.get(
  '/api/users',
  {},
  {
    signal: controller.signal
  }
)

// 取消请求
controller.abort()
```

## 🔧 错误处理

### 1. HTTP 状态码处理

系统自动处理以下状态码：

| 状态码 | 处理方式                        |
| ------ | ------------------------------- |
| 401    | 提示"登录已过期"，跳转登录页    |
| 403    | 提示"没有权限访问"，跳转 403 页 |
| 404    | 提示"请求的资源不存在"          |
| 500    | 提示"服务器错误"                |
| 502    | 提示"网关错误"                  |
| 503    | 提示"服务不可用"                |
| 504    | 提示"网关超时"                  |

### 2. 业务错误处理

```typescript
// 后端返回格式
interface ResponseData {
  code: number // 业务状态码
  message: string // 提示信息
  data: any // 数据
  success: boolean // 是否成功
}

// 自动处理
// code === 200 或 success === true 时，返回 data
// 否则显示错误提示并 reject
```

### 3. 自定义错误处理

```typescript
try {
  const data = await api.user.getList(params)
} catch (error) {
  // 自定义错误处理
  if (error.response?.status === 404) {
    ElMessage.warning('用户不存在')
  } else {
    ElMessage.error('获取用户列表失败')
  }
}
```

## 🌍 环境配置

### 1. 环境变量

```bash
# .env.development
VITE_API_BASE_URL = /api
VITE_USE_PROXY = true
VITE_PROXY_TARGET = http://localhost:3000

# .env.production
VITE_API_BASE_URL = https://api.example.com
VITE_USE_PROXY = false
```

### 2. 代理配置

开发环境自动配置代理：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

请求示例：

```typescript
// 前端请求: /api/users
// 实际请求: http://localhost:3000/users
```

## 💡 最佳实践

### 1. API 模块化管理

```
api/
├── modules/
│   ├── auth.ts      # 认证相关
│   ├── user.ts      # 用户管理
│   ├── role.ts      # 角色管理
│   ├── menu.ts      # 菜单管理
│   └── ...
└── index.ts         # 统一导出
```

### 2. 类型定义

```typescript
// 定义请求参数类型
export interface UserQueryParams extends PageParams {
  username?: string
  status?: number
}

// 定义响应数据类型
export interface User {
  id: number
  username: string
  nickname: string
}

// 使用泛型
request.get<PageResult<User>>('/api/users', params)
```

### 3. 统一的响应格式

```typescript
// 后端统一返回格式
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "success": true
}

// 前端自动解析，直接返回 data
const data = await request.get('/api/users')
console.log(data) // 直接是 data 部分
```

### 4. Loading 管理

```typescript
// 自动管理 Loading
// 多个请求同时发起时，Loading 会正确显示和隐藏

const [users, roles] = await Promise.all([api.user.getList(params), api.role.getList(params)])
// Loading 会在所有请求完成后才隐藏
```

### 5. 错误提示

```typescript
// 默认显示错误提示
await api.user.getList(params)

// 不显示错误提示，自己处理
try {
  await api.user.getList(params)
} catch (error) {
  // 自定义错误处理
}
```

### 6. 成功提示

```typescript
// 需要显示成功提示的操作
await api.user.create(data) // 自动显示"创建成功"
await api.user.update(id, data) // 自动显示"更新成功"
await api.user.delete(id) // 自动显示"删除成功"

// 自定义成功提示
await request.post('/api/users', data, {
  showSuccess: true,
  successMessage: '用户创建成功！'
})
```

## 📝 完整示例

### 用户管理页面

```vue
<template>
  <div class="user-page">
    <el-button @click="handleAdd">新增</el-button>
    <el-table :data="tableData" :loading="loading">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)">编辑</el-button>
          <el-button @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/api'
import type { User } from '@/api/modules/user'

const loading = ref(false)
const tableData = ref<User[]>([])

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const result = await api.user.getList({
      page: 1,
      pageSize: 10
    })
    tableData.value = result.list
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = async () => {
  await api.user.create({
    username: 'john',
    nickname: 'John Doe'
  })
  getList()
}

// 编辑
const handleEdit = async (row: User) => {
  await api.user.update(row.id, {
    nickname: 'New Name'
  })
  getList()
}

// 删除
const handleDelete = async (row: User) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
  await api.user.delete(row.id)
  getList()
}

onMounted(() => {
  getList()
})
</script>
```

## 🔗 相关文件

- Axios 封装：`src/utils/request.ts`
- API 模块：`src/api/`
- 环境配置：`.env.development`、`.env.production`
- Vite 配置：`vite.config.ts`

## 🎓 总结

通过这套 Axios 封装，你可以：

1. ✅ 统一管理所有 API 请求
2. ✅ 自动处理 Token、Loading、错误提示
3. ✅ 模块化管理 API，代码更清晰
4. ✅ 类型安全，开发体验更好
5. ✅ 易于维护和扩展

遵循这些最佳实践，可以构建一个健壮、易维护的前端请求层。

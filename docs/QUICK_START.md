# 快速开始

## 🎉 欢迎使用后台管理系统

本系统已经集成了完整的功能模块，包括：

- ✅ RBAC 权限管理
- ✅ Axios 请求封装
- ✅ NProgress 进度条
- ✅ 完整的登录流程
- ✅ 动态菜单系统

## 🚀 快速体验

### 1. 启动开发服务器

开发服务器已经在运行：`http://localhost:5174/`

### 2. 登录系统

访问登录页面，使用以下测试账号：

| 账号   | 密码   | 角色       | 说明               |
| ------ | ------ | ---------- | ------------------ |
| admin  | admin  | 超级管理员 | 拥有所有权限和菜单 |
| user   | user   | 普通用户   | 基础权限，部分菜单 |
| editor | editor | 编辑人员   | 编辑权限，部分菜单 |

### 3. 查看演示页面

登录后，访问以下演示页面：

- **权限演示**：组件示例 → 权限演示
- **进度条演示**：组件示例 → 进度条演示
- **登录流程演示**：组件示例 → 登录流程演示

## 📚 功能文档

### 1. RBAC 权限管理

- 详细文档：`RBAC_GUIDE.md`
- 快速开始：`RBAC_QUICKSTART.md`

**核心功能**：

- 用户、角色、权限管理
- 路由级权限控制
- 菜单级权限控制
- 按钮级权限控制

**使用示例**：

```vue
<template>
  <!-- 权限指令 -->
  <el-button v-auth="'system:user:add'">新增</el-button>

  <!-- 角色指令 -->
  <el-button v-role="'admin'">管理员操作</el-button>
</template>

<script setup>
import { hasAuth, hasRole } from '@/utils/auth'

// 代码中判断权限
if (hasAuth('system:user:add')) {
  // 执行操作
}
</script>
```

### 2. Axios 请求封装

- 详细文档：`AXIOS_GUIDE.md`

**核心功能**：

- 统一的请求/响应拦截
- 自动添加 Token
- 统一错误处理
- Loading 加载状态
- 文件上传/下载

**使用示例**：

```typescript
import { api } from '@/api'

// 获取用户列表
const users = await api.user.getList({ page: 1, pageSize: 10 })

// 创建用户
await api.user.create({ username: 'john', nickname: 'John' })
```

### 3. NProgress 进度条

- 详细文档：`NPROGRESS_GUIDE.md`

**核心功能**：

- 路由切换自动显示
- 支持亮色/暗色主题
- 可手动控制进度

**使用示例**：

```typescript
import NProgress from '@/utils/nprogress'

// 开始进度条
NProgress.start()

// 设置进度
NProgress.set(0.5)

// 完成进度条
NProgress.done()
```

### 4. 登录流程

- 详细文档：`LOGIN_FLOW_GUIDE.md`

**登录流程**：

1. 调用登录接口 → 返回 accessToken 和 refreshToken
2. 获取用户信息 → 返回用户信息和权限
3. 获取用户菜单 → 返回当前用户可访问的菜单

**使用示例**：

```typescript
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// 登录
const result = await userStore.login('admin', 'admin')

if (result.success) {
  console.log('登录成功')
  console.log('Token:', userStore.token)
  console.log('用户信息:', userStore.userInfo)
}
```

## 🎯 核心功能

### 1. 用户管理

- 路径：`/system/user`
- 权限：`system:user:list`
- 功能：用户列表、新增、编辑、删除

### 2. 角色管理

- 路径：`/system/role`
- 权限：`system:role:list`
- 功能：角色列表、新增、编辑、删除、权限分配

### 3. 菜单管理

- 路径：`/system/menu`
- 权限：`system:menu:list`
- 功能：菜单列表、新增、编辑、删除

### 4. 个人中心

- 路径：`/user/profile`
- 功能：个人信息、修改密码、安全设置

## 🔧 开发指南

### 1. 添加新页面

```typescript
// 1. 创建页面组件
// src/views/example/index.vue

// 2. 添加路由
// src/router/routes/modules/example.ts
export default {
  path: '/example',
  name: 'Example',
  component: Layout,
  meta: {
    title: '示例页面',
    icon: 'ri:file-line',
    roles: ['admin'],
    auths: ['example:view']
  },
  children: [...]
}
```

### 2. 添加 API 接口

```typescript
// src/api/modules/example.ts
import { request } from '@/utils/request'

export const exampleApi = {
  getList(params) {
    return request.get('/example/list', params)
  },

  create(data) {
    return request.post('/example', data, {
      showSuccess: true,
      successMessage: '创建成功'
    })
  }
}

// src/api/index.ts
export { exampleApi } from './modules/example'
```

### 3. 使用权限控制

```vue
<template>
  <!-- 路由权限在 meta 中配置 -->

  <!-- 按钮权限使用指令 -->
  <el-button v-auth="'example:add'">新增</el-button>

  <!-- 代码中判断权限 -->
  <el-button v-if="canEdit">编辑</el-button>
</template>

<script setup>
import { hasAuth } from '@/utils/auth'

const canEdit = computed(() => hasAuth('example:edit'))
</script>
```

## 📦 项目结构

```
src/
├── api/                 # API 接口
│   ├── modules/        # API 模块
│   └── index.ts        # 统一导出
├── assets/             # 静态资源
├── components/         # 全局组件
├── config/             # 配置文件
├── directives/         # 全局指令
├── enums/              # 枚举
├── layouts/            # 布局组件
├── mock/               # Mock 数据
├── router/             # 路由配置
├── stores/             # 状态管理
├── styles/             # 全局样式
├── utils/              # 工具函数
└── views/              # 页面组件
```

## 🎨 主题配置

### 1. 切换主题

点击右上角设置按钮，可以：

- 切换亮色/暗色主题
- 修改主题色
- 切换布局模式
- 调整页面动画

### 2. 布局模式

支持 4 种布局模式：

- 垂直布局（默认）
- 水平布局
- 混合布局
- 双列布局

## 🔒 安全建议

1. **Token 管理**
   - Token 存储在 localStorage
   - 自动添加到请求头
   - 401 自动跳转登录

2. **权限验证**
   - 前端权限只是 UI 控制
   - 后端必须进行权限验证

3. **密码安全**
   - 不在前端存储密码
   - 使用 HTTPS 传输

## 📝 常见问题

### 1. 如何对接真实后端？

参考 `AXIOS_GUIDE.md` 和 `LOGIN_FLOW_GUIDE.md` 中的"对接真实后端"章节。

### 2. 如何添加新的权限？

在路由 meta 中配置 `roles` 或 `auths`：

```typescript
meta: {
  roles: ['admin'],
  auths: ['system:user:add']
}
```

### 3. 如何自定义菜单？

修改 `src/mock/data.ts` 中的菜单数据，或对接后端菜单接口。

### 4. 如何修改主题色？

点击右上角设置按钮，在主题设置中修改。

## 🎓 学习资源

- Vue 3 文档：https://cn.vuejs.org/
- Element Plus 文档：https://element-plus.org/zh-CN/
- Pinia 文档：https://pinia.vuejs.org/zh/
- Vue Router 文档：https://router.vuejs.org/zh/

## 💬 技术支持

如有问题，请查看相关文档：

- `RBAC_GUIDE.md` - RBAC 权限管理
- `AXIOS_GUIDE.md` - Axios 请求封装
- `NPROGRESS_GUIDE.md` - NProgress 进度条
- `LOGIN_FLOW_GUIDE.md` - 登录流程

## 🎉 开始使用

现在你可以：

1. ✅ 访问 `http://localhost:5174/` 登录系统
2. ✅ 使用测试账号体验不同权限
3. ✅ 查看演示页面了解功能
4. ✅ 开始开发你的业务功能

祝你使用愉快！🚀

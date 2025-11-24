# NProgress 进度条使用指南

## 📋 简介

NProgress 是一个轻量级的进度条库，用于在路由切换和异步请求时显示加载进度。

## ✨ 功能特性

- ✅ 路由切换自动显示进度条
- ✅ 支持亮色/暗色主题自动适配
- ✅ 自定义主题色（跟随系统主色）
- ✅ 平滑的动画效果
- ✅ 可手动控制进度
- ✅ 支持多个请求并发管理

## 📁 文件结构

```
src/
├── utils/
│   └── nprogress.ts          # NProgress 工具类
├── styles/
│   └── nprogress.scss        # 自定义样式
└── router/
    └── guard.ts              # 路由守卫（集成 NProgress）
```

## 🚀 使用方法

### 1. 路由切换（自动）

路由切换时会自动显示进度条，无需手动调用。

```typescript
// src/router/guard.ts
router.beforeEach((to, from, next) => {
  NProgress.start() // 自动开始
  // ... 路由逻辑
  next()
})

router.afterEach(() => {
  NProgress.done() // 自动完成
})
```

### 2. 手动控制

```typescript
import NProgress from '@/utils/nprogress'

// 开始进度条
NProgress.start()

// 设置进度（0-1）
NProgress.set(0.5) // 设置到 50%

// 增加进度
NProgress.inc() // 增加一点进度
NProgress.inc(0.2) // 增加 20%

// 完成进度条
NProgress.done()
```

### 3. 异步请求中使用

```typescript
const fetchData = async () => {
  NProgress.start()
  try {
    const data = await api.getData()
    return data
  } finally {
    NProgress.done()
  }
}
```

### 4. 在组件中使用

```vue
<template>
  <el-button @click="handleClick">加载数据</el-button>
</template>

<script setup lang="ts">
import NProgress from '@/utils/nprogress'

const handleClick = async () => {
  NProgress.start()

  try {
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 可以手动更新进度
    NProgress.set(0.5)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('加载完成')
  } finally {
    NProgress.done()
  }
}
</script>
```

## ⚙️ 配置选项

### 默认配置

```typescript
NProgress.configure({
  showSpinner: false, // 不显示右上角的加载圈
  trickleSpeed: 200, // 自动递增间隔（ms）
  minimum: 0.3, // 最小百分比
  easing: 'ease', // 动画方式
  speed: 500 // 递增进度条的速度（ms）
})
```

### 自定义配置

```typescript
import NProgress from '@/utils/nprogress'

// 显示加载圈
NProgress.configure({
  showSpinner: true
})

// 调整速度
NProgress.configure({
  speed: 300,
  trickleSpeed: 100
})

// 调整最小进度
NProgress.configure({
  minimum: 0.1
})
```

## 🎨 样式自定义

### 修改进度条颜色

进度条颜色会自动跟随系统主色，如果需要自定义：

```scss
// src/styles/nprogress.scss
#nprogress {
  .bar {
    background: #409eff !important; // 自定义颜色
  }

  .peg {
    box-shadow:
      0 0 10px #409eff,
      0 0 5px #409eff;
  }
}
```

### 修改进度条高度

```scss
#nprogress {
  .bar {
    height: 5px; // 默认 3px
  }
}
```

### 修改进度条位置

```scss
#nprogress {
  .bar {
    top: 0; // 顶部（默认）
    // bottom: 0;  // 底部
  }
}
```

## 📝 API 文档

### NProgress 方法

| 方法                 | 参数              | 说明       |
| -------------------- | ----------------- | ---------- |
| `start()`            | -                 | 开始进度条 |
| `done()`             | -                 | 完成进度条 |
| `set(n)`             | `n: number (0-1)` | 设置进度   |
| `inc(n?)`            | `n?: number`      | 增加进度   |
| `configure(options)` | `options: object` | 配置选项   |

### NProgressManager 方法

```typescript
import { nprogressManager } from '@/utils/nprogress'

// 开始（支持多个请求并发）
nprogressManager.start()

// 完成（自动管理多个请求）
nprogressManager.done()

// 强制完成（忽略请求计数）
nprogressManager.forceDone()

// 设置进度
nprogressManager.set(0.5)

// 增加进度
nprogressManager.inc(0.2)
```

## 💡 最佳实践

### 1. 路由切换

路由切换时自动显示进度条，已在路由守卫中集成，无需额外配置。

### 2. API 请求

如果需要在 API 请求时显示进度条，可以在 axios 拦截器中添加：

```typescript
// src/utils/request.ts
import { nprogressManager } from '@/utils/nprogress'

// 请求拦截器
service.interceptors.request.use((config) => {
  if (config.showProgress !== false) {
    nprogressManager.start()
  }
  return config
})

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    nprogressManager.done()
    return response
  },
  (error) => {
    nprogressManager.done()
    return Promise.reject(error)
  }
)
```

### 3. 长时间操作

对于长时间操作，可以手动更新进度：

```typescript
const processLargeFile = async (file: File) => {
  NProgress.start()

  try {
    // 步骤 1: 读取文件
    NProgress.set(0.2)
    const content = await readFile(file)

    // 步骤 2: 处理数据
    NProgress.set(0.5)
    const processed = await processData(content)

    // 步骤 3: 上传
    NProgress.set(0.8)
    await uploadData(processed)

    // 完成
    NProgress.done()
  } catch (error) {
    NProgress.done()
    throw error
  }
}
```

### 4. 多个并发请求

使用 `nprogressManager` 自动管理多个请求：

```typescript
import { nprogressManager } from '@/utils/nprogress'

// 多个请求同时发起
const [users, roles, menus] = await Promise.all([
  api.user.getList(),
  api.role.getList(),
  api.menu.getList()
])
// 进度条会在所有请求完成后才消失
```

## 🎯 使用场景

### 1. 页面跳转

```typescript
// 自动处理，无需手动调用
router.push('/user')
```

### 2. 数据加载

```vue
<script setup>
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  NProgress.start()

  try {
    const data = await api.getData()
    tableData.value = data
  } finally {
    NProgress.done()
    loading.value = false
  }
}
</script>
```

### 3. 表单提交

```vue
<script setup>
const handleSubmit = async () => {
  NProgress.start()

  try {
    await api.submitForm(formData)
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    NProgress.done()
  }
}
</script>
```

### 4. 文件上传

```vue
<script setup>
const handleUpload = async (file: File) => {
  NProgress.start()

  try {
    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      NProgress.set(i / 100)
    }

    ElMessage.success('上传成功')
  } finally {
    NProgress.done()
  }
}
</script>
```

## 🔧 故障排除

### 进度条不显示

1. 检查是否正确导入：

```typescript
import NProgress from '@/utils/nprogress'
```

2. 检查样式是否加载：

```typescript
import '@/styles/nprogress.scss'
```

3. 检查是否调用了 `start()` 和 `done()`

### 进度条卡住不消失

```typescript
// 强制完成进度条
import { nprogressManager } from '@/utils/nprogress'
nprogressManager.forceDone()
```

### 进度条颜色不对

检查 CSS 变量是否正确：

```scss
#nprogress .bar {
  background: var(--el-color-primary) !important;
}
```

## 📚 相关文件

- NProgress 工具：`src/utils/nprogress.ts`
- 自定义样式：`src/styles/nprogress.scss`
- 路由守卫：`src/router/guard.ts`
- 演示页面：`src/views/demo/nprogress.vue`

## 🎓 总结

通过集成 NProgress，你可以：

1. ✅ 自动显示路由切换进度
2. ✅ 提升用户体验
3. ✅ 统一的加载状态展示
4. ✅ 灵活的手动控制
5. ✅ 主题色自动适配

访问 **组件示例 → 进度条演示** 查看完整的使用示例和效果展示。

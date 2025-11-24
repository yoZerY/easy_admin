<template>
  <div class="nprogress-demo p-6">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">NProgress 进度条演示</span>
          <el-tag type="success">已集成</el-tag>
        </div>
      </template>

      <el-alert type="info" :closable="false" class="mb-4">
        <template #title>
          <div class="space-y-2">
            <p>✅ 路由切换时自动显示进度条</p>
            <p>✅ 支持亮色/暗色主题自动适配</p>
            <p>✅ 自定义主题色（跟随系统主色）</p>
            <p>✅ 平滑的动画效果</p>
          </div>
        </template>
      </el-alert>

      <div class="space-y-6">
        <!-- 路由切换演示 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">1. 路由切换进度条</h3>
          <p class="text-gray-600 mb-4">点击下面的按钮切换路由，观察顶部进度条效果：</p>
          <div class="flex gap-4 flex-wrap">
            <el-button type="primary" @click="$router.push('/')">
              <SvgIcon icon="ri:home-line" class="mr-1" />
              首页
            </el-button>
            <el-button type="success" @click="$router.push('/system/user')">
              <SvgIcon icon="ri:user-line" class="mr-1" />
              用户管理
            </el-button>
            <el-button type="warning" @click="$router.push('/system/role')">
              <SvgIcon icon="ri:admin-line" class="mr-1" />
              角色管理
            </el-button>
            <el-button type="info" @click="$router.push('/components/permission')">
              <SvgIcon icon="ri:shield-check-line" class="mr-1" />
              权限演示
            </el-button>
          </div>
        </div>

        <el-divider />

        <!-- 手动控制演示 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">2. 手动控制进度条</h3>
          <p class="text-gray-600 mb-4">通过代码手动控制进度条：</p>
          <div class="flex gap-4 flex-wrap">
            <el-button @click="handleStart">开始进度条</el-button>
            <el-button @click="handleDone">完成进度条</el-button>
            <el-button @click="handleSet(0.5)">设置到 50%</el-button>
            <el-button @click="handleInc">增加进度</el-button>
          </div>
        </div>

        <el-divider />

        <!-- 模拟请求演示 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">3. 模拟异步请求</h3>
          <p class="text-gray-600 mb-4">模拟异步请求时的进度条效果：</p>
          <div class="flex gap-4 flex-wrap">
            <el-button type="primary" :loading="loading1" @click="simulateRequest(1000)">
              快速请求 (1s)
            </el-button>
            <el-button type="success" :loading="loading2" @click="simulateRequest(3000)">
              中速请求 (3s)
            </el-button>
            <el-button type="warning" :loading="loading3" @click="simulateRequest(5000)">
              慢速请求 (5s)
            </el-button>
          </div>
        </div>

        <el-divider />

        <!-- 配置说明 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">4. 配置说明</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="显示位置">页面顶部</el-descriptions-item>
            <el-descriptions-item label="进度条高度">3px</el-descriptions-item>
            <el-descriptions-item label="主题色"
              >跟随系统主色（可在设置面板修改）</el-descriptions-item
            >
            <el-descriptions-item label="显示加载圈">否（可配置）</el-descriptions-item>
            <el-descriptions-item label="动画速度">500ms</el-descriptions-item>
            <el-descriptions-item label="最小进度">30%</el-descriptions-item>
            <el-descriptions-item label="自动递增">是</el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider />

        <!-- 代码示例 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">5. 代码示例</h3>
          <el-tabs>
            <el-tab-pane label="路由守卫">
              <pre class="code-block"><code>import NProgress from '@/utils/nprogress'

router.beforeEach((to, from, next) => {
  NProgress.start()
  // ... 路由逻辑
  next()
})

router.afterEach(() => {
  NProgress.done()
})</code></pre>
            </el-tab-pane>

            <el-tab-pane label="手动控制">
              <pre class="code-block"><code>import NProgress from '@/utils/nprogress'

// 开始进度条
NProgress.start()

// 设置进度（0-1）
NProgress.set(0.5)

// 增加进度
NProgress.inc()

// 完成进度条
NProgress.done()</code></pre>
            </el-tab-pane>

            <el-tab-pane label="异步请求">
              <pre class="code-block"><code>const fetchData = async () => {
  NProgress.start()
  try {
    const data = await api.getData()
    return data
  } finally {
    NProgress.done()
  }
}</code></pre>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import NProgress from '@/utils/nprogress'

defineOptions({
  name: 'NProgressDemo'
})

const loading1 = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)

// 开始进度条
const handleStart = () => {
  NProgress.start()
}

// 完成进度条
const handleDone = () => {
  NProgress.done()
}

// 设置进度
const handleSet = (n: number) => {
  NProgress.set(n)
}

// 增加进度
const handleInc = () => {
  NProgress.inc()
}

// 模拟请求
const simulateRequest = async (duration: number) => {
  const loadingRef = duration === 1000 ? loading1 : duration === 3000 ? loading2 : loading3

  loadingRef.value = true
  NProgress.start()

  try {
    // 模拟请求过程中的进度更新
    const steps = 10
    const stepDuration = duration / steps

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration))
      NProgress.set((i + 1) / steps)
    }

    ElMessage.success(`请求完成 (${duration / 1000}s)`)
  } finally {
    NProgress.done()
    loadingRef.value = false
  }
}
</script>

<style lang="scss" scoped>
.nprogress-demo {
  background: var(--el-bg-color);
  min-height: 100%;

  .code-block {
    background: var(--el-fill-color-light);
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-primary);
  }
}
</style>

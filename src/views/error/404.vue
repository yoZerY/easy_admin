<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        <SvgIcon icon="ri:file-search-line" size="120" color="#909399" />
      </div>
      <h1 class="error-title">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <div class="error-actions">
        <el-button type="primary" @click="goBack">返回上一页</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Error404'
})

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--el-bg-color);
}

.error-content {
  text-align: center;
}

.error-icon {
  margin-bottom: 24px;
}

.error-title {
  font-size: 72px;
  font-weight: bold;
  color: #909399;
  margin-bottom: 16px;
}

.error-message {
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>

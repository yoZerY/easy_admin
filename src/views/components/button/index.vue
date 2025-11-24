<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">按钮组件</h2>
    <el-card class="mb-4">
      <h3 class="text-lg font-semibold mb-3">IconButton 示例</h3>
      <div class="flex gap-4 items-center flex-wrap">
        <IconButton icon="ri:home-line" />
        <IconButton icon="ri:settings-line" size="sm" />
        <IconButton icon="ri:heart-line" size="lg" variant="danger" />
        <IconButton icon="ri:star-line" variant="warning" shape="circle" />
        <IconButton icon="ri:check-line" variant="success">确认</IconButton>
        <IconButton icon="ri:close-line" variant="danger" :loading="false" />
      </div>
    </el-card>
    <el-card>
      <h3 class="text-lg font-semibold mb-3">Element Plus 按钮</h3>
      <div class="flex gap-2 flex-wrap">
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ComponentButtonPage'
})
</script>

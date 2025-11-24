<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">数据分析</h2>
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500">总用户数</div>
          <div class="text-3xl font-bold mt-2">1,234</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500">今日访问</div>
          <div class="text-3xl font-bold mt-2">567</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500">订单数</div>
          <div class="text-3xl font-bold mt-2">890</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500">收入</div>
          <div class="text-3xl font-bold mt-2">¥12,345</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'DashboardAnalysisPage'
})
</script>

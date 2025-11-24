<template>
  <div class="p-6">
    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500 text-sm mb-2">CPU使用率</div>
          <div class="text-3xl font-bold">45%</div>
          <el-progress :percentage="45" :show-text="false" class="mt-2" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500 text-sm mb-2">内存使用率</div>
          <div class="text-3xl font-bold">62%</div>
          <el-progress :percentage="62" :show-text="false" class="mt-2" status="warning" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500 text-sm mb-2">磁盘使用率</div>
          <div class="text-3xl font-bold">38%</div>
          <el-progress :percentage="38" :show-text="false" class="mt-2" status="success" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="text-gray-500 text-sm mb-2">网络流量</div>
          <div class="text-3xl font-bold">1.2 GB</div>
          <div class="text-sm text-gray-500 mt-2">今日流量</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'MonitorServerPage'
})
</script>

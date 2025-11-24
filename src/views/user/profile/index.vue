<template>
  <div class="p-6">
    <el-card class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">个人信息</span>
          <el-button type="primary" size="small">编辑</el-button>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">admin</el-descriptions-item>
        <el-descriptions-item label="邮箱">admin@example.com</el-descriptions-item>
        <el-descriptions-item label="手机号">138****8888</el-descriptions-item>
        <el-descriptions-item label="角色">超级管理员</el-descriptions-item>
        <el-descriptions-item label="部门">技术部</el-descriptions-item>
        <el-descriptions-item label="创建时间">2024-01-01</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'UserProfilePage'
})
</script>

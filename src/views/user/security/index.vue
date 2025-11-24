<template>
  <div class="p-6">
    <el-card class="mb-4">
      <template #header>
        <span class="text-lg font-semibold">修改密码</span>
      </template>
      <el-form :model="passwordForm" label-width="100px" style="max-width: 600px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <template #header>
        <span class="text-lg font-semibold">安全设置</span>
      </template>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 border rounded">
          <div>
            <div class="font-medium">双因素认证</div>
            <div class="text-sm text-gray-500">增强账号安全性</div>
          </div>
          <el-switch />
        </div>
        <div class="flex items-center justify-between p-4 border rounded">
          <div>
            <div class="font-medium">登录通知</div>
            <div class="text-sm text-gray-500">新设备登录时发送通知</div>
          </div>
          <el-switch />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'UserSecurityPage'
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
</script>

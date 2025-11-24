<template>
  <div class="p-6">
    <el-card>
      <template #header>
        <span class="text-lg font-semibold">账号设置</span>
      </template>
      <el-form :model="form" label-width="100px">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" :rows="4" placeholder="请输入个人简介" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'UserSettingsPage'
})

const form = reactive({
  nickname: 'Admin',
  email: 'admin@example.com',
  phone: '13800138000',
  bio: ''
})
</script>

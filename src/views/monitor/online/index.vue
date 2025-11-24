<template>
  <div class="p-6">
    <el-card>
      <template #header>
        <span class="text-lg font-semibold">在线用户</span>
      </template>
      <el-table :data="onlineUsers" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="location" label="登录地点" />
        <el-table-column prop="browser" label="浏览器" />
        <el-table-column prop="loginTime" label="登录时间" />
        <el-table-column label="操作" width="120">
          <template #default>
            <el-button size="small" type="danger" link>强制下线</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'MonitorOnlinePage'
})

const onlineUsers = [
  {
    username: 'admin',
    ip: '192.168.1.100',
    location: '上海',
    browser: 'Chrome 120',
    loginTime: '2024-01-01 09:00:00'
  },
  {
    username: 'user1',
    ip: '192.168.1.101',
    location: '北京',
    browser: 'Firefox 121',
    loginTime: '2024-01-01 10:30:00'
  }
]
</script>

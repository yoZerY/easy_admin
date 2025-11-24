<template>
  <div class="login-flow-demo p-6">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">登录流程演示</span>
          <el-tag type="success">Mock 数据</el-tag>
        </div>
      </template>

      <el-alert type="info" :closable="false" class="mb-4">
        <template #title>
          <div class="space-y-2">
            <p><strong>登录流程：</strong></p>
            <p>1️⃣ 调用登录接口 → 返回 accessToken 和 refreshToken</p>
            <p>2️⃣ 使用 accessToken 获取用户信息 → 返回用户信息和权限</p>
            <p>3️⃣ 使用 accessToken 获取用户菜单 → 返回当前用户可访问的菜单</p>
          </div>
        </template>
      </el-alert>

      <!-- 当前登录状态 -->
      <div v-if="userStore.isLogin" class="mb-6">
        <h3 class="text-lg font-semibold mb-4">当前登录状态</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">
            {{ userStore.userInfo?.username }}
          </el-descriptions-item>
          <el-descriptions-item label="昵称">
            {{ userStore.userInfo?.nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="Access Token">
            <el-text truncated class="max-w-[200px]">{{ userStore.token }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="Refresh Token">
            <el-text truncated class="max-w-[200px]">{{ userStore.refreshToken }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-tag v-for="role in userStore.roles" :key="role" class="mr-2">
              {{ role }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="权限数量">
            {{ userStore.permissions.length }} 个
          </el-descriptions-item>
          <el-descriptions-item label="菜单数量" :span="2">
            {{ menuStore.getMenus.length }} 个
          </el-descriptions-item>
        </el-descriptions>

        <div class="mt-4">
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </div>

      <!-- 测试账号 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">测试账号</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="test-account-card">
              <div class="text-center">
                <SvgIcon icon="ri:admin-line" size="48" color="#409eff" class="mb-2" />
                <h4 class="font-semibold mb-2">超级管理员</h4>
                <p class="text-sm text-gray-600 mb-4">拥有所有权限</p>
                <el-button type="primary" size="small" @click="quickLogin('admin', 'admin')">
                  快速登录
                </el-button>
                <div class="mt-2 text-xs text-gray-500">
                  <p>账号：admin</p>
                  <p>密码：admin</p>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card shadow="hover" class="test-account-card">
              <div class="text-center">
                <SvgIcon icon="ri:user-line" size="48" color="#67c23a" class="mb-2" />
                <h4 class="font-semibold mb-2">普通用户</h4>
                <p class="text-sm text-gray-600 mb-4">基础权限</p>
                <el-button type="success" size="small" @click="quickLogin('user', 'user')">
                  快速登录
                </el-button>
                <div class="mt-2 text-xs text-gray-500">
                  <p>账号：user</p>
                  <p>密码：user</p>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card shadow="hover" class="test-account-card">
              <div class="text-center">
                <SvgIcon icon="ri:edit-line" size="48" color="#e6a23c" class="mb-2" />
                <h4 class="font-semibold mb-2">编辑人员</h4>
                <p class="text-sm text-gray-600 mb-4">编辑权限</p>
                <el-button type="warning" size="small" @click="quickLogin('editor', 'editor')">
                  快速登录
                </el-button>
                <div class="mt-2 text-xs text-gray-500">
                  <p>账号：editor</p>
                  <p>密码：editor</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 登录日志 -->
      <div v-if="loginLogs.length > 0">
        <h3 class="text-lg font-semibold mb-4">登录日志</h3>
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in loginLogs"
            :key="index"
            :timestamp="log.time"
            :type="log.type"
          >
            {{ log.message }}
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 用户菜单 -->
      <div v-if="menuStore.getMenus.length > 0" class="mt-6">
        <h3 class="text-lg font-semibold mb-4">当前用户菜单</h3>
        <el-table :data="menuStore.getMenus" border>
          <el-table-column prop="name" label="菜单名称" width="150" />
          <el-table-column prop="path" label="路径" width="200" />
          <el-table-column label="图标" width="100">
            <template #default="{ row }">
              <SvgIcon :icon="row.meta.icon" size="20" />
            </template>
          </el-table-column>
          <el-table-column prop="meta.title" label="标题" />
          <el-table-column prop="meta.rank" label="排序" width="80" />
          <el-table-column label="显示" width="80">
            <template #default="{ row }">
              <el-tag :type="row.meta.showLink ? 'success' : 'info'" size="small">
                {{ row.meta.showLink ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user'
import { useMenuStore } from '@/stores/modules/menu'

defineOptions({
  name: 'LoginFlowDemo'
})

const userStore = useUserStore()
const menuStore = useMenuStore()

interface LoginLog {
  time: string
  message: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const loginLogs = ref<LoginLog[]>([])

// 添加日志
const addLog = (message: string, type: LoginLog['type'] = 'info') => {
  loginLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
}

// 快速登录
const quickLogin = async (username: string, password: string) => {
  loginLogs.value = []
  addLog(`开始登录，用户名：${username}`, 'primary')

  try {
    const result = await userStore.login(username, password)

    if (result.success) {
      addLog('✅ 登录成功', 'success')
      addLog(`✅ 获取到 Token: ${userStore.token.substring(0, 20)}...`, 'success')
      addLog(`✅ 用户信息: ${userStore.userInfo?.nickname}`, 'success')
      addLog(`✅ 角色: ${userStore.roles.join(', ')}`, 'success')
      addLog(`✅ 权限数量: ${userStore.permissions.length}`, 'success')
      addLog(`✅ 菜单数量: ${menuStore.getMenus.length}`, 'success')
      ElMessage.success('登录成功')
    } else {
      addLog(`❌ 登录失败: ${result.message}`, 'danger')
      ElMessage.error(result.message || '登录失败')
    }
  } catch (error) {
    addLog(`❌ 登录异常: ${error}`, 'danger')
    ElMessage.error('登录失败')
  }
}

// 退出登录
const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    type: 'warning'
  })

  await userStore.logout()
  loginLogs.value = []
  addLog('已退出登录', 'info')
  ElMessage.success('已退出登录')
}
</script>

<style lang="scss" scoped>
.login-flow-demo {
  background: var(--el-bg-color);
  min-height: 100%;

  .test-account-card {
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

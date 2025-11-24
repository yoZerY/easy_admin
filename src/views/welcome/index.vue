<template>
  <div class="welcome-page p-6">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">欢迎使用后台管理系统</h1>
      <p class="text-gray-500">Welcome to Admin Dashboard</p>
    </div>

    <el-row :gutter="20" class="mb-6">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-2">总用户数</div>
              <div class="text-3xl font-bold">1,234</div>
            </div>
            <SvgIcon icon="ri:user-line" size="48" color="#409eff" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-2">今日访问</div>
              <div class="text-3xl font-bold">567</div>
            </div>
            <SvgIcon icon="ri:eye-line" size="48" color="#67c23a" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-2">订单数</div>
              <div class="text-3xl font-bold">890</div>
            </div>
            <SvgIcon icon="ri:shopping-cart-line" size="48" color="#e6a23c" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-2">收入</div>
              <div class="text-3xl font-bold">¥12,345</div>
            </div>
            <SvgIcon icon="ri:money-dollar-circle-line" size="48" color="#f56c6c" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">快速导航</span>
              <SvgIcon icon="ri:compass-line" />
            </div>
          </template>
          <div class="grid grid-cols-2 gap-4">
            <router-link to="/system/user" class="nav-item">
              <SvgIcon icon="ri:user-line" size="24" />
              <span>用户管理</span>
            </router-link>
            <router-link to="/system/role" class="nav-item">
              <SvgIcon icon="ri:admin-line" size="24" />
              <span>角色管理</span>
            </router-link>
            <router-link to="/dashboard/analysis" class="nav-item">
              <SvgIcon icon="ri:line-chart-line" size="24" />
              <span>数据分析</span>
            </router-link>
            <router-link to="/components/button" class="nav-item">
              <SvgIcon icon="ri:apps-line" size="24" />
              <span>组件示例</span>
            </router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">系统信息</span>
              <SvgIcon icon="ri:information-line" />
            </div>
          </template>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">系统版本</span>
              <span class="font-medium">v1.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Vue 版本</span>
              <span class="font-medium">3.5.x</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Element Plus</span>
              <span class="font-medium">2.x</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tailwind CSS</span>
              <span class="font-medium">4.x</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'WelcomePage'
})
</script>

<style lang="scss" scoped>
.welcome-page {
  .stat-card {
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-4px);
    }
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    background: #f5f7fa;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;

    &:hover {
      background: #e4e7ed;
      transform: translateX(4px);
    }
  }
}
</style>

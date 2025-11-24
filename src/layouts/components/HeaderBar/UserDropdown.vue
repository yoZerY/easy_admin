<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div class="user-dropdown">
      <el-avatar :src="userStore.userInfo?.avatar" :size="32">
        <SvgIcon icon="ri:user-line" />
      </el-avatar>
      <span class="username">{{ userStore.userInfo?.nickname }}</span>
      <SvgIcon icon="ri:arrow-down-s-line" size="16" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">
          <SvgIcon icon="ri:user-line" class="mr-2" />
          个人中心
        </el-dropdown-item>
        <el-dropdown-item command="settings">
          <SvgIcon icon="ri:settings-line" class="mr-2" />
          个人设置
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">
          <SvgIcon icon="ri:logout-box-line" class="mr-2" />
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user'
import { useMenuStore } from '@/stores/modules/menu'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'UserDropdown'
})

const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    await userStore.logout()
    menuStore.clearMenus()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 取消退出
  }
}
</script>

<style lang="scss" scoped>
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--el-fill-color-light);
  }

  .username {
    font-size: 14px;
    color: var(--el-text-color-primary);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

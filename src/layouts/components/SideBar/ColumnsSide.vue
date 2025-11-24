<template>
  <div class="columns-sidebar">
    <div v-if="visibleChildren.length > 0" class="sidebar-title">
      <SvgIcon v-if="currentMenuIcon" :icon="currentMenuIcon" size="18" />
      <span>{{ currentMenuTitle }}</span>
    </div>
    <el-menu v-if="visibleChildren.length > 0" :default-active="activeRouteMenu" router>
      <sidebar-item v-for="child in visibleChildren" :key="child.path" :item="child" />
    </el-menu>
    <div v-else class="empty-sidebar">
      <SvgIcon icon="ri:inbox-line" size="48" />
      <p>暂无子菜单</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { menuRoutes } from '@/router/routes'
import { useRoute } from 'vue-router'
import { hasAuth, hasRole } from '@/utils/auth'
import SidebarItem from './components/SidebarItem.vue'

defineOptions({
  name: 'ColumnsSideBar'
})

interface Props {
  activeMenu?: string
}

const props = defineProps<Props>()
const route = useRoute()

// 当前激活的路由菜单项
const activeRouteMenu = computed(() => {
  return route.path
})

// 当前选中的一级菜单的子菜单
const currentMenuChildren = computed(() => {
  if (!props.activeMenu) return []
  const currentMenu = menuRoutes.find((item) => item.path === props.activeMenu)
  return currentMenu?.children || []
})

// 过滤可见的子菜单
const visibleChildren = computed(() => {
  return currentMenuChildren.value.filter((child) => {
    // 过滤隐藏的菜单
    if (child.meta?.hiddenTag) return false
    // 过滤不显示的菜单
    if (child.meta?.showLink === false) return false

    // 检查角色权限
    if (child.meta?.roles && !hasRole(child.meta.roles)) return false

    // 检查操作权限
    if (child.meta?.auths && !hasAuth(child.meta.auths)) return false

    return true
  })
})

// 当前菜单标题
const currentMenuTitle = computed(() => {
  if (!props.activeMenu) return ''
  const currentMenu = menuRoutes.find((item) => item.path === props.activeMenu)
  return (currentMenu?.meta?.title as string) || ''
})

// 当前菜单图标
const currentMenuIcon = computed(() => {
  if (!props.activeMenu) return ''
  const currentMenu = menuRoutes.find((item) => item.path === props.activeMenu)
  return (currentMenu?.meta?.icon as string) || ''
})
</script>

<style lang="scss" scoped>
.columns-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);

  .sidebar-title {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    border-bottom: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-lighter);
  }

  :deep(.el-menu) {
    flex: 1;
    border-right: none;
    background: transparent;
    padding: 8px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--el-border-color-light);
      border-radius: 2px;

      &:hover {
        background: var(--el-border-color);
      }
    }

    // 菜单项通用样式
    .el-menu-item {
      height: 42px !important;
      border-radius: 8px;
      transition: all 0.3s;
      margin-bottom: 4px;
    }

    // 菜单项 hover 效果
    .el-menu-item:hover {
      background-color: var(--el-fill-color-light) !important;
    }

    // 激活的菜单项
    .el-menu-item.is-active {
      background-color: var(--el-color-primary-light-9) !important;
      color: var(--el-color-primary) !important;
      font-weight: 600;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background: var(--el-color-primary);
        border-radius: 0 3px 3px 0;
      }

      .svg-icon {
        color: var(--el-color-primary);
      }
    }
  }

  .empty-sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
    gap: 16px;

    p {
      font-size: 14px;
      margin: 0;
    }
  }
}
</style>

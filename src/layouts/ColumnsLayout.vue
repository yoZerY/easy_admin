<template>
  <div class="layout-container layout-columns">
    <div class="layout-menu">
      <div class="menu-logo">
        <SvgIcon icon="ri:vuejs-fill" size="32" />
      </div>
      <div class="menu-list">
        <div
          v-for="route in menuRoutes"
          :key="route.path"
          :class="['menu-item', { active: activeFirstMenu === route.path }]"
          @click="handleFirstMenuClick(route)"
        >
          <SvgIcon v-if="route.meta?.icon" :icon="route.meta.icon" size="24" />
          <span class="menu-label">{{ route.meta?.title }}</span>
        </div>
      </div>
    </div>
    <ColumnsSide class="layout-sidebar" :active-menu="activeFirstMenu" />
    <div class="layout-main">
      <div class="layout-header">
        <Breadcrumb class="header-breadcrumb" />
        <HeaderBar class="header-actions" />
      </div>
      <TagsView class="layout-tags" />
      <Content class="layout-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderBar from './components/HeaderBar/index.vue'
import ColumnsSide from './components/SideBar/ColumnsSide.vue'
import Content from './components/Content/index.vue'
import TagsView from './components/TagsView/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'
import { menuRoutes } from '@/router/routes'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

defineOptions({
  name: 'ColumnsLayout'
})

const route = useRoute()
const router = useRouter()

// 当前激活的一级菜单
const activeFirstMenu = ref('')

// 根据当前路由确定激活的一级菜单
const updateActiveFirstMenu = () => {
  const currentPath = route.path
  for (const item of menuRoutes) {
    if (item.children && item.children.length > 0) {
      const hasActiveChild = item.children.some((child) => child.path === currentPath)
      if (hasActiveChild) {
        activeFirstMenu.value = item.path
        return
      }
    } else if (item.path === currentPath) {
      activeFirstMenu.value = item.path
      return
    }
  }
  // 默认选中第一个
  if (menuRoutes.length > 0 && menuRoutes[0]) {
    activeFirstMenu.value = menuRoutes[0].path
  }
}

// 点击一级菜单
const handleFirstMenuClick = (menuItem: RouteRecordRaw) => {
  activeFirstMenu.value = menuItem.path
  // 如果有子菜单，跳转到第一个子菜单
  if (menuItem.children && menuItem.children.length > 0 && menuItem.children[0]) {
    router.push(menuItem.children[0].path)
  } else {
    router.push(menuItem.path)
  }
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateActiveFirstMenu()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.layout-columns {
  .layout-menu {
    width: 80px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, var(--el-fill-color-darker), var(--el-fill-color-dark));
    border-right: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 101;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(
        180deg,
        transparent,
        var(--el-color-primary-light-8) 50%,
        transparent
      );
      opacity: 0.3;
    }

    .menu-logo {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--el-border-color-lighter);
      color: var(--el-color-primary);
      position: relative;
      transition: all 0.3s;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background: var(--el-color-primary);
        transition: width 0.3s;
      }

      &:hover {
        transform: scale(1.1);

        &::after {
          width: 60%;
        }
      }
    }

    .menu-list {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 8px 0;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--el-border-color);
        border-radius: 2px;

        &:hover {
          background: var(--el-border-color-dark);
        }
      }

      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 14px 8px;
        margin: 6px 10px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--el-text-color-regular);
        position: relative;
        overflow: hidden;

        .menu-label {
          font-size: 12px;
          text-align: center;
          line-height: 1.2;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
          transition: all 0.3s;
        }

        &:hover {
          background: var(--el-fill-color-light);
          color: var(--el-text-color-primary);
        }

        &.active {
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }
      }
    }
  }

  .layout-sidebar {
    width: 200px;
    flex-shrink: 0;
    border-right: 1px solid var(--el-border-color-lighter);
  }

  .layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .layout-header {
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    position: relative;
    z-index: 100;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--el-color-primary-light-8) 50%,
        transparent
      );
      opacity: 0.5;
    }

    .header-breadcrumb {
      flex: 1;
      min-width: 0;
    }

    .header-actions {
      flex-shrink: 0;
      padding: 0 20px;
    }
  }

  .layout-content {
    flex: 1;
    overflow: auto;
    background: var(--el-fill-color-lighter);
  }
}
</style>

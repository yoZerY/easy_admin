<template>
  <div class="layout-container layout-mixed">
    <div class="layout-header-wrapper">
      <div class="layout-logo">
        <SvgIcon icon="ri:vuejs-fill" size="28" />
        <span class="logo-text">Admin</span>
      </div>
      <div class="layout-menu">
        <div
          v-for="route in menuRoutes"
          :key="route.path"
          :class="['menu-item', { active: activeTopMenu === route.path }]"
          @click="handleTopMenuClick(route)"
        >
          <SvgIcon v-if="route.meta?.icon" :icon="route.meta.icon" size="18" />
          <span>{{ route.meta?.title }}</span>
        </div>
      </div>
      <div class="layout-actions">
        <HeaderBar />
      </div>
    </div>
    <div class="layout-body">
      <MixedSide class="layout-sidebar" :active-menu="activeTopMenu" />
      <div class="layout-main">
        <TagsView class="layout-tags" />
        <Content class="layout-content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderBar from './components/HeaderBar/index.vue'
import MixedSide from './components/SideBar/MixedSide.vue'
import Content from './components/Content/index.vue'
import TagsView from './components/TagsView/index.vue'
import { menuRoutes } from '@/router/routes'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

defineOptions({
  name: 'MixedLayout'
})

const route = useRoute()
const router = useRouter()

// 当前激活的顶部菜单
const activeTopMenu = ref('')

// 根据当前路由确定激活的顶部菜单
const updateActiveTopMenu = () => {
  const currentPath = route.path
  for (const item of menuRoutes) {
    if (item.children && item.children.length > 0) {
      const hasActiveChild = item.children.some((child) => child.path === currentPath)
      if (hasActiveChild) {
        activeTopMenu.value = item.path
        return
      }
    } else if (item.path === currentPath) {
      activeTopMenu.value = item.path
      return
    }
  }
  // 默认选中第一个
  if (menuRoutes.length > 0 && menuRoutes[0]) {
    activeTopMenu.value = menuRoutes[0].path
  }
}

// 点击顶部菜单
const handleTopMenuClick = (menuItem: RouteRecordRaw) => {
  activeTopMenu.value = menuItem.path
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
    updateActiveTopMenu()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.layout-mixed {
  .layout-header-wrapper {
    display: flex;
    align-items: center;
    height: 64px;
    flex-shrink: 0;
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
  }

  .layout-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 28px;
    flex-shrink: 0;
    height: 100%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 32px;
      background: linear-gradient(
        180deg,
        transparent,
        var(--el-border-color-light) 50%,
        transparent
      );
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.5px;
    }
  }

  .layout-menu {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 20px;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      height: 0;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-regular);
      cursor: pointer;
      white-space: nowrap;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, transparent, var(--el-color-primary-light-9));
        opacity: 0;
        transition: opacity 0.3s;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, var(--el-color-primary), transparent);
        border-radius: 3px 3px 0 0;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      > * {
        position: relative;
        z-index: 1;
      }

      &:hover {
        background: var(--el-fill-color-light);
        color: var(--el-text-color-primary);
        transform: translateY(-2px);

        &::before {
          opacity: 1;
        }

        &::after {
          width: 70%;
        }
      }

      &.active {
        color: var(--el-color-primary);
        font-weight: 600;
        background: var(--el-color-primary-light-9);

        &::after {
          width: 100%;
        }
      }
    }
  }

  .layout-actions {
    display: flex;
    align-items: center;
    padding: 0 20px;
    flex-shrink: 0;
  }

  .layout-body {
    flex: 1;
    display: flex;
    overflow: hidden;
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

  .layout-content {
    flex: 1;
    overflow: auto;
    background: var(--el-fill-color-lighter);
  }
}
</style>

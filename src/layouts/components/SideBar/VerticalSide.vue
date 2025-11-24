<template>
  <div class="sidebar-container">
    <div class="sidebar-logo">
      <SvgIcon icon="ri:vuejs-fill" :size="collapsed ? 28 : 32" />
      <Transition name="logo-text">
        <span v-show="!collapsed" class="logo-text">Admin</span>
      </Transition>
    </div>
    <el-menu
      :default-active="activeMenu"
      :default-openeds="defaultOpeneds"
      :collapse="collapsed"
      unique-opened
      router
    >
      <sidebar-item v-for="route in routerStore.getMergedRoutes" :key="route.path" :item="route" />
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useRouterStore } from '@/stores/modules/router'
import SidebarItem from './components/SidebarItem.vue'

defineOptions({
  name: 'VerticalSideBar'
})

interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const route = useRoute()
const routerStore = useRouterStore()

// 当前激活的菜单项
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 默认展开的子菜单
const defaultOpeneds = computed(() => {
  const { path } = route
  const openeds: string[] = []

  // 查找当前路由所属的父菜单
  routerStore.getMergedRoutes.forEach((item) => {
    if (item.children && item.children.length > 0) {
      const hasActiveChild = item.children.some((child) => child.path === path)
      if (hasActiveChild) {
        openeds.push(item.path)
      }
    }
  })

  return openeds
})
</script>

<!-- <style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);

  .sidebar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 64px;
    padding: 0 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  :deep(.el-menu) {
    flex: 1;
    border-right: none;
    background: transparent;
    padding: 8px;
    overflow-y: auto;
    overflow-x: hidden;

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

    // 覆盖 Element Plus 默认动画，延迟文字消失
    .el-menu-item span,
    .el-sub-menu__title span {
      transition:
        opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
    }

    .el-menu-item,
    .el-sub-menu__title {
      height: 42px !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .el-sub-menu__icon-arrow {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    // 折叠状态
    &.el-menu--collapse {
      padding: 8px 4px;

      .el-menu-item,
      .el-sub-menu__title {
        padding: 0 !important;
        justify-content: center;
      }

      .el-menu-item span,
      .el-sub-menu__title span {
        opacity: 0;
        width: 0;
      }

      .el-sub-menu__icon-arrow {
        opacity: 0;
        width: 0;
      }
    }

    // 菜单项通用样式
    .el-menu-item,
    .el-sub-menu__title {
      margin: 4px 0;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // 菜单项 hover 效果
    .el-menu-item:hover,
    .el-sub-menu__title:hover {
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

    // 子菜单标题激活状态
    .el-sub-menu.is-active > .el-sub-menu__title {
      color: var(--el-color-primary) !important;
      font-weight: 600;

      .svg-icon {
        color: var(--el-color-primary);
      }
    }

    // 子菜单项
    .el-menu-item {
      padding-left: 48px !important;
    }
  }
}

// 子菜单弹出层（全局样式，不使用 scoped）
</style>

<style lang="scss">
.el-menu--popup {
  padding: 10px !important;
  border-radius: 12px !important;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
  backdrop-filter: blur(16px);
  border: none !important;
  background: var(--el-bg-color-overlay) !important;
  min-width: 200px !important;
  animation: popupSlideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  .el-menu-item {
    height: 42px !important;
    margin: 4px 0 !important;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative;
    overflow: hidden;
    border: none !important;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, var(--el-color-primary-light-9));
      opacity: 0;
      transition: opacity 0.3s;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    &:hover {
      background-color: var(--el-fill-color-light) !important;
      transform: translateX(6px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      &::before {
        opacity: 1;
      }

      .svg-icon {
        transform: scale(1.15) rotate(5deg);
        color: var(--el-color-primary);
      }
    }

    &.is-active {
      background: linear-gradient(
        135deg,
        var(--el-color-primary-light-9),
        var(--el-color-primary-light-8)
      ) !important;
      color: var(--el-color-primary) !important;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 70%;
        background: linear-gradient(
          180deg,
          var(--el-color-primary),
          var(--el-color-primary-light-3)
        );
        border-radius: 0 4px 4px 0;
        box-shadow: 0 0 8px var(--el-color-primary);
      }

      .svg-icon {
        color: var(--el-color-primary);
      }
    }
  }
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// Logo 文字过渡动画
.logo-text-enter-active,
.logo-text-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-text-enter-from,
.logo-text-leave-to {
  opacity: 0;
  transform: translateX(-10px);
  width: 0;
}

.logo-text-enter-to,
.logo-text-leave-from {
  opacity: 1;
  transform: translateX(0);
  width: auto;
}
</style> -->

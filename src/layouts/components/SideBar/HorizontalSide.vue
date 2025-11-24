<template>
  <div class="horizontal-sidebar">
    <el-menu
      :default-active="activeMenu"
      mode="horizontal"
      router
      :ellipsis="false"
      class="horizontal-menu"
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <!-- 有子菜单 -->
        <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
          <template #title>
            <SvgIcon v-if="route.meta?.icon" :icon="route.meta.icon" class="menu-icon" />
            <span class="menu-title">{{ route.meta?.title }}</span>
          </template>
          <el-menu-item v-for="child in route.children" :key="child.path" :index="child.path">
            <SvgIcon v-if="child.meta?.icon" :icon="child.meta.icon" class="menu-icon" />
            <span class="menu-title">{{ child.meta?.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 无子菜单 -->
        <el-menu-item v-else :index="route.path">
          <SvgIcon v-if="route.meta?.icon" :icon="route.meta.icon" class="menu-icon" />
          <span class="menu-title">{{ route.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { menuRoutes } from '@/router/routes'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'HorizontalSideBar'
})

const route = useRoute()

// 当前激活的菜单项
const activeMenu = computed(() => {
  const { path } = route
  return path
})
</script>

<style lang="scss" scoped>
.horizontal-sidebar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .menu-icon {
    margin-right: 8px;
    transition: all 0.3s;
  }

  .menu-title {
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
  }

  :deep(.horizontal-menu) {
    border-bottom: none;
    background: transparent;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    // 菜单项通用样式
    .el-menu-item,
    .el-sub-menu__title {
      height: 100%;
      display: flex;
      align-items: center;
      margin: 0 4px;
      padding: 0 20px !important;
      border-radius: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      border-bottom: none !important;
      white-space: nowrap;
      flex-shrink: 0;

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
        z-index: 1;
      }
    }

    // 菜单项 hover 效果
    .el-menu-item:hover,
    .el-sub-menu__title:hover {
      background-color: var(--el-fill-color-light) !important;

      &::before {
        opacity: 1;
      }

      &::after {
        width: 70%;
      }

      .menu-icon {
        transform: scale(1.1);
        color: var(--el-color-primary);
      }

      .menu-title {
        color: var(--el-text-color-primary);
      }
    }

    // 激活的菜单项
    .el-menu-item.is-active {
      background-color: transparent !important;
      color: var(--el-color-primary) !important;

      &::after {
        width: 100%;
      }

      .menu-icon {
        color: var(--el-color-primary);
      }

      .menu-title {
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }

    // 子菜单标题激活状态
    .el-sub-menu.is-active > .el-sub-menu__title {
      color: var(--el-color-primary) !important;

      &::after {
        width: 100%;
      }

      .menu-icon {
        color: var(--el-color-primary);
      }

      .menu-title {
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }

    // 子菜单标题布局
    .el-sub-menu__title {
      .menu-icon {
        flex-shrink: 0;
      }

      .menu-title {
        flex-shrink: 0;
      }
    }

    // 子菜单箭头图标
    .el-sub-menu__icon-arrow {
      margin-left: 8px !important;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    // 子菜单弹出层
    .el-menu--popup {
      padding: 10px;
      border-radius: 12px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(16px);
      border: none !important;
      background: var(--el-bg-color-overlay);
      min-width: 220px;
      animation: popupSlideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      .el-menu-item {
        height: auto;
        margin: 4px 0;
        padding: 12px 18px !important;
        border-radius: 10px;
        border: none !important;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, var(--el-color-primary-light-9));
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 10px;
        }

        &::after {
          display: none;
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

          .menu-icon {
            transform: scale(1.15) rotate(5deg);
            color: var(--el-color-primary);
          }

          .menu-title {
            color: var(--el-text-color-primary);
          }
        }

        &.is-active {
          background: linear-gradient(
            135deg,
            var(--el-color-primary-light-9),
            var(--el-color-primary-light-8)
          ) !important;
          color: var(--el-color-primary) !important;
          box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);

          &::before {
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
            opacity: 1;
          }

          .menu-icon {
            color: var(--el-color-primary);
          }

          .menu-title {
            font-weight: 600;
            color: var(--el-color-primary);
          }
        }
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
</style>

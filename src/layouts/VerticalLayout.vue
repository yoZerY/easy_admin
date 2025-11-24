<template>
  <div class="layout-container layout-vertical">
    <VerticalSide :collapsed="isCollapsed" class="layout-sidebar" />
    <div class="layout-main">
      <div class="layout-header-wrapper">
        <div class="header-left">
          <IconButton
            :icon="isCollapsed ? 'ri:menu-unfold-line' : 'ri:menu-fold-line'"
            size="md"
            @click="toggleCollapse"
          />
          <div class="header-divider"></div>
          <Breadcrumb class="header-breadcrumb" />
        </div>
        <div class="header-right">
          <HeaderBar />
        </div>
      </div>
      <TagsView class="layout-tags" />
      <Content class="layout-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderBar from './components/HeaderBar/index.vue'
import VerticalSide from './components/SideBar/VerticalSide.vue'
import Content from './components/Content/index.vue'
import TagsView from './components/TagsView/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'

defineOptions({
  name: 'VerticalLayout'
})

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.layout-vertical {
  .layout-sidebar {
    width: 200px;
    flex-shrink: 0;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-right: 1px solid var(--el-border-color-lighter);
    overflow: hidden;

    &:has(.el-menu--collapse) {
      width: 64px;
    }
  }

  .layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

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

    .header-left {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 16px;
      overflow: hidden;

      .header-divider {
        width: 1px;
        height: 28px;
        background: linear-gradient(
          180deg,
          transparent,
          var(--el-border-color-light) 50%,
          transparent
        );
        flex-shrink: 0;
      }

      .header-breadcrumb {
        flex: 1;
        min-width: 0;
      }
    }

    .header-right {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
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

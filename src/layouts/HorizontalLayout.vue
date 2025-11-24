<template>
  <div class="layout-container layout-horizontal">
    <div class="layout-header-wrapper">
      <div class="layout-logo">
        <SvgIcon icon="ri:vuejs-fill" size="28" />
        <span class="logo-text">Admin</span>
      </div>
      <div class="layout-menu">
        <HorizontalSide />
      </div>
      <div class="layout-actions">
        <HeaderBar />
      </div>
    </div>
    <TagsView class="layout-tags" />
    <Content class="layout-content" />
  </div>
</template>

<script lang="ts" setup>
import HeaderBar from './components/HeaderBar/index.vue'
import HorizontalSide from './components/SideBar/HorizontalSide.vue'
import Content from './components/Content/index.vue'
import TagsView from './components/TagsView/index.vue'

defineOptions({
  name: 'HorizontalLayout'
})
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.layout-horizontal {
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
    padding: 0 20px;
    overflow: visible;
    min-width: 0;
  }

  .layout-actions {
    display: flex;
    align-items: center;
    padding: 0 20px;
    flex-shrink: 0;
  }

  .layout-content {
    flex: 1;
    overflow: auto;
    background: var(--el-fill-color-lighter);
  }
}
</style>

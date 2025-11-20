<template>
  <div class="flex items-center">
    <div id="logo" class="w-50 flex items-center justify-center">Easy Admin</div>
    <el-menu
      mode="horizontal"
      :default-active="activePath"
      :ellipsis="false"
      router
      :popper-offset="14"
      :popper-style="{
        borderRadius: '6px',
        border: 'none'
      }"
    >
      <el-menu-item index="/dashboard/analysis">
        <SvgIcon class="text-xl" icon="solar:alarm-remove-outline" />
        <template #title>
          <span>analysis</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/dashboard/workbench">
        <SvgIcon class="text-xl" icon="solar:alarm-remove-outline" />
        <template #title>
          <span>workbench</span>
        </template>
      </el-menu-item>
      <el-sub-menu index="/system">
        <template #title>
          <SvgIcon class="text-xl" icon="solar:alarm-remove-outline" />
          <span>System</span>
        </template>
        <el-menu-item index="/system/user">user</el-menu-item>
        <el-menu-item index="/system/role">role</el-menu-item>
        <el-menu-item index="/system/department">department</el-menu-item>
        <el-menu-item index="/system/menu">menu</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/1-1">
        <template #title>
          <SvgIcon class="text-xl" icon="solar:alarm-remove-outline" />
          <span>1-1</span>
        </template>
        <el-menu-item index="1-1-1">1-1-1</el-menu-item>
        <el-sub-menu index="/1-2">
          <template #title>
            <SvgIcon class="text-xl" icon="solar:alarm-remove-outline" />
            <span>1-2</span>
          </template>
          <el-menu-item index="1-2-1">1-2-1</el-menu-item>
          <el-menu-item index="1-2-2">1-2-2</el-menu-item>
          <el-sub-menu index="/1-3">
            <template #title>
              <SvgIcon class="text-xl" icon="solar:alarm-remove-outline" />
              <span>1-3</span>
            </template>
            <el-menu-item index="1-3-1">1-3-1</el-menu-item>
            <el-menu-item index="1-3-2">1-3-2</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
defineOptions({
  name: 'HorizontalMenu'
})
const route = useRoute()
const activePath = computed(() => route.path)
</script>
<style lang="scss" scoped>
:deep(.el-menu) {
  &.el-menu--horizontal {
    .el-menu-item,
    .el-sub-menu__title {
      border-bottom: none;
      &:hover {
        background-color: transparent;
      }
      &.is-active {
        background-color: transparent;
      }
    }
  }
}
</style>
<style lang="scss">
.el-menu--popup-container {
  .el-menu--popup {
    padding: 8px 0 4px 0;
    border-radius: 6px;
    .el-menu-item {
      height: 46px;
      margin: 0 8px 4px 8px;
      border-radius: 6px;
      &:hover {
        background-color: var(--el-color-info-light-9);
      }
      &.is-active {
        background-color: var(--el-color-primary-light-9);
      }
    }

    .el-sub-menu {
      .el-sub-menu__title {
        height: 46px;
        margin: 0 8px 4px 8px;
        border-radius: 6px;
        &:hover {
          background-color: var(--el-color-info-light-9);
        }
      }
    }
  }
}
</style>

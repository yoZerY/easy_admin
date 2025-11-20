<template>
  <div class="vertical flex">
    <div
      class="side-bar border-r border-solid border-(--el-color-info-light-7) transition-all duration-300"
      :style="menuStyles"
    >
      <VerticalMenu></VerticalMenu>
    </div>
    <div class="app-main flex-1 flex flex-col transition-all duration-300">
      <div class="app-header">
        <HeaderBar></HeaderBar>
      </div>
      <div class="app-content flex-1 overflow-y-scroll">
        <Content class="m-4 h-[calc(100%-40px)]"></Content>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import VerticalMenu from '../components/MenuBar/VerticalMenu/index.vue'
import HeaderBar from '../components/HeaderBar/index.vue'
import Content from '../components/Content/index.vue'
import { useSettingStore } from '@/stores/modules/setting'
import { computed } from 'vue'
defineOptions({
  name: 'VerticalLayout'
})
const settingStore = useSettingStore()
const menuStyles = computed(() => {
  return {
    width: settingStore.menuCollapse ? '65px' : '220px'
  }
})
</script>
<style lang="scss" scoped></style>

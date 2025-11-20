<template>
  <div class="mixed flex">
    <div class="side-bar w-[220px] border-r border-solid border-(--el-color-info-light-7)">
      mixedmenu
    </div>
    <div class="app-main flex-1 flex flex-col">
      <div class="app-header">
        <HeaderBar></HeaderBar>
      </div>
      <div class="app-content flex-1 overflow-y-scroll">
        <Content class="m-4 min-h-[calc(100%-40px)]"></Content>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderBar from '../components/HeaderBar/index.vue'
import Content from '../components/Content/index.vue'
defineOptions({
  name: 'VerticalLayout'
})
</script>
<style lang="scss" scoped></style>

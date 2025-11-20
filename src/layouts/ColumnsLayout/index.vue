<template>
  <div class="column flex">
    <div class="side-bar flex">
      <div class="first-level-menu w-18 border-r border-solid border-(--el-color-info-light-7)">
        aa
      </div>
      <div class="w-[220px] border-r border-solid border-(--el-color-info-light-7)">menulist</div>
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

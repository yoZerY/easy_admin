<template>
  <div class="horizontal flex flex-col">
    <div class="app-header">
      <HeaderBar></HeaderBar>
    </div>
    <div class="app-content flex-1 overflow-y-scroll">
      <Content class="m-4 min-h-[calc(100%-40px)]"></Content>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderBar from '../components/HeaderBar/index.vue'
import Content from '../components/Content/index.vue'

defineOptions({
  name: 'HorizontalLayout'
})
</script>
<style lang="scss" scoped></style>

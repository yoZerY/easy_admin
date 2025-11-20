<template>
  <ElDrawer size="350" v-model="settingPanelVisible" title="系统设置">
    <ThemeMode />
    <LayoutType />
    <SystemColor />
  </ElDrawer>
</template>
<script lang="ts" setup>
import { emitter } from '@/utils/mitt'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ThemeMode from './components/ThemeMode/index.vue'
import LayoutType from './components/LayoutType/index.vue'
import SystemColor from './components/SystemColor/index.vue'

defineOptions({
  name: 'SettingPanel'
})

const settingPanelVisible = ref(false)

onMounted(() => {
  emitter.on('openSettingPanel', () => {
    settingPanelVisible.value = true
  })
})

onBeforeUnmount(() => {
  emitter.off('openSettingPanel')
})
</script>
<style lang="scss" scoped></style>

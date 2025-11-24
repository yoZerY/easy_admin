<template>
  <ElDrawer size="350" v-model="settingPanelVisible" title="系统设置">
    <ThemeMode />
    <LayoutType />
    <TagsViewStyle />
    <PageTransition />
    <SystemColor />
  </ElDrawer>
</template>
<script lang="ts" setup>
import LayoutType from './components/LayoutType/index.vue'
import ThemeMode from './components/ThemeMode/index.vue'
import SystemColor from './components/SystemColor/index.vue'
import PageTransition from './components/PageTransition/index.vue'
import TagsViewStyle from './components/TagsViewStyle/index.vue'
import { emitter } from '@/utils/mitt'

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

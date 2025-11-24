<template>
  <Transition name="layout-fade" mode="out-in">
    <component :is="currentLayout" :key="settingStore.layoutType" />
  </Transition>
  <SettingPanel />
</template>

<script lang="ts" setup>
import { LAYOUT_CONFIGS } from '@/config/layout'
import { useSettingStore } from '@/stores/modules/setting'
import SettingPanel from './components/SettingPanel/index.vue'

defineOptions({
  name: 'AppLayout'
})

const settingStore = useSettingStore()

const currentLayout = computed(() => {
  const config = LAYOUT_CONFIGS.find((item) => item.type === settingStore.layoutType)
  console.log('config', config)
  return config?.component
})
console.log(currentLayout)
</script>

<style lang="scss" scoped>
.layout-fade-enter-active,
.layout-fade-leave-active {
  transition: opacity 0.2s ease;
}

.layout-fade-enter-from,
.layout-fade-leave-to {
  opacity: 0;
}
</style>

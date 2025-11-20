<template>
  <Transition name="layout-fade" mode="out-in">
    <component class="app-layout" :is="currentLayout" :key="settingStore.layoutType" />
  </Transition>
  <SettingPanel></SettingPanel>
</template>
<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/setting'
import SettingPanel from './components/SettingPanel/index.vue'
import { computed } from 'vue'
import { LAYOUTS } from './layout'

defineOptions({
  name: 'AppLayout'
})
const settingStore = useSettingStore()
const currentLayout = computed(() => {
  const config = LAYOUTS.find((item) => item.type === settingStore.layoutType)
  return config?.component
})
console.log(currentLayout)
</script>
<style lang="scss" scoped>
.app-layout {
  width: 100%;
  height: 100%;
}
</style>

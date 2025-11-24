<template>
  <div class="header-bar">
    <IconButton
      :icon="isDark ? 'ri:sun-line' : 'ri:moon-line'"
      @click="toggleTheme"
      title="切换主题"
    />
    <IconButton
      :icon="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'"
      @click="toggleFullscreen"
      title="全屏"
    />
    <IconButton icon="ri:settings-line" @click="openSetting" title="设置" />
    <UserDropdown />
  </div>
</template>

<script lang="ts" setup>
import { emitter } from '@/utils/mitt'
import { useSettingStore } from '@/stores/modules/setting'
import { ThemeModeEnum } from '@/enums/theme'
import UserDropdown from './UserDropdown.vue'

defineOptions({
  name: 'HeaderBar'
})

const settingStore = useSettingStore()

// 是否暗色模式
const isDark = computed(() => settingStore.isDark)

// 是否全屏
const isFullscreen = ref(false)

// 切换主题
const toggleTheme = () => {
  const newMode = settingStore.isDark ? ThemeModeEnum.LIGHT : ThemeModeEnum.DARK
  settingStore.setThemeMode(newMode)
}

// 切换全屏
const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    try {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } catch (err) {
      console.error('进入全屏失败:', err)
    }
  } else {
    try {
      await document.exitFullscreen()
      isFullscreen.value = false
    } catch (err) {
      console.error('退出全屏失败:', err)
    }
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 打开设置面板
const openSetting = () => {
  emitter.emit('openSettingPanel')
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style lang="scss" scoped>
.header-bar {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

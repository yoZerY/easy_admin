<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<script lang="ts" setup>
import { PageTransitionEnum } from '@/enums'
import { useSettingStore } from '@/stores/modules/setting'
import { computed } from 'vue'

defineOptions({
  name: 'AppContent'
})

const settingStore = useSettingStore()

const transitionName = computed(() => {
  const transition = settingStore.pageTransition
  if (transition === PageTransitionEnum.NONE) {
    return ''
  }
  return transition
})
</script>

<style lang="scss" scoped>
// 淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 从右滑入
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 从左滑入
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

// 从上滑入
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

// 从下滑入
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

// 缩放
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}
.zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

// 缩放淡入
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: all 0.3s ease;
}
.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>

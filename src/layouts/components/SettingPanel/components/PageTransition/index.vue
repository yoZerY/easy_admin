<template>
  <div class="setting-item">
    <el-divider content-position="center">页面切换动画</el-divider>
    <div class="transition-grid">
      <div
        v-for="item in transitionList"
        :key="item.value"
        :class="['transition-item', { active: settingStore.pageTransition === item.value }]"
        @click="handleSelect(item.value)"
      >
        <div class="transition-item__preview">
          <div class="preview-box">
            <div :class="['preview-element', item.animation]">
              <SvgIcon :icon="item.icon" size="14" />
            </div>
          </div>
        </div>
        <div class="transition-item__label">{{ item.label }}</div>
        <div v-if="settingStore.pageTransition === item.value" class="transition-item__check">
          <SvgIcon icon="ri:check-line" size="12" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/setting'
import { PageTransitionEnum } from '@/enums/theme'

defineOptions({
  name: 'PageTransition'
})

const settingStore = useSettingStore()

const transitionList = [
  {
    label: '无动画',
    value: PageTransitionEnum.NONE,
    icon: 'ri:close-line',
    animation: 'none'
  },
  {
    label: '淡入淡出',
    value: PageTransitionEnum.FADE,
    icon: 'ri:contrast-2-line',
    animation: 'fade'
  },
  {
    label: '右滑入',
    value: PageTransitionEnum.SLIDE_RIGHT,
    icon: 'ri:arrow-right-line',
    animation: 'slide-right'
  },
  {
    label: '左滑入',
    value: PageTransitionEnum.SLIDE_LEFT,
    icon: 'ri:arrow-left-line',
    animation: 'slide-left'
  },
  {
    label: '上滑入',
    value: PageTransitionEnum.SLIDE_UP,
    icon: 'ri:arrow-up-line',
    animation: 'slide-up'
  },
  {
    label: '下滑入',
    value: PageTransitionEnum.SLIDE_DOWN,
    icon: 'ri:arrow-down-line',
    animation: 'slide-down'
  },
  {
    label: '缩放',
    value: PageTransitionEnum.ZOOM,
    icon: 'ri:zoom-in-line',
    animation: 'zoom'
  },
  {
    label: '缩放淡入',
    value: PageTransitionEnum.ZOOM_FADE,
    icon: 'ri:focus-3-line',
    animation: 'zoom-fade'
  }
]

const handleSelect = (value: PageTransitionEnum) => {
  settingStore.setPageTransition(value)
}
</script>

<style lang="scss" scoped>
.transition-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.transition-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 3px;
  border: 2px solid var(--el-border-color-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--el-bg-color);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, var(--el-color-primary-light-9) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: var(--el-color-primary-light-5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }

    .preview-element {
      animation-play-state: running;
    }
  }

  &.active {
    border-color: var(--el-color-primary);
    background: linear-gradient(
      135deg,
      var(--el-bg-color) 0%,
      var(--el-color-primary-light-9) 100%
    );
    box-shadow: 0 0 0 3px var(--el-color-primary-light-8);

    .transition-item__label {
      color: var(--el-color-primary);
      font-weight: 600;
    }

    .preview-element {
      color: var(--el-color-primary);
    }
  }

  &__preview {
    position: relative;
    z-index: 1;
    width: 100%;
    margin-bottom: 4px;
  }

  &__label {
    position: relative;
    z-index: 1;
    font-size: 10px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    transition: all 0.3s;
    text-align: center;
    line-height: 1.2;
  }

  &__check {
    position: absolute;
    top: 3px;
    right: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: var(--el-color-primary);
    color: white;
    border-radius: 50%;
    z-index: 2;
    animation: checkBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}

.preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  overflow: hidden;
}

.preview-element {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--el-color-primary-light-8);
  border-radius: 4px;
  color: var(--el-text-color-regular);
  transition: all 0.3s;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-play-state: paused;

  &.fade {
    animation-name: previewFade;
  }

  &.slide-right {
    animation-name: previewSlideRight;
  }

  &.slide-left {
    animation-name: previewSlideLeft;
  }

  &.slide-up {
    animation-name: previewSlideUp;
  }

  &.slide-down {
    animation-name: previewSlideDown;
  }

  &.zoom {
    animation-name: previewZoom;
  }

  &.zoom-fade {
    animation-name: previewZoomFade;
  }
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes previewFade {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes previewSlideRight {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(8px);
  }
}

@keyframes previewSlideLeft {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-8px);
  }
}

@keyframes previewSlideUp {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes previewSlideDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

@keyframes previewZoom {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.85);
  }
}

@keyframes previewZoomFade {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.85);
    opacity: 0.5;
  }
}
</style>

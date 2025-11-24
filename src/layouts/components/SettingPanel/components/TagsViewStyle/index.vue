<template>
  <div class="setting-item">
    <div class="setting-item__header">
      <div class="setting-item__title">
        <SvgIcon icon="ri:price-tag-3-line" size="18" class="mr-2" />
        标签页样式
      </div>
      <el-switch v-model="settingStore.showTagsView" @change="handleToggle" />
    </div>
    <div v-if="settingStore.showTagsView" class="style-grid">
      <div
        v-for="item in styleList"
        :key="item.value"
        :class="['style-item', { active: settingStore.tagsViewStyle === item.value }]"
        @click="handleSelect(item.value)"
      >
        <div class="style-preview">
          <div :class="['preview-tags', `preview-${item.value}`]">
            <div class="preview-tag">
              <span class="preview-dot"></span>
            </div>
            <div class="preview-tag active">
              <span class="preview-dot"></span>
            </div>
            <div class="preview-tag">
              <span class="preview-dot"></span>
            </div>
          </div>
        </div>
        <div class="style-label">{{ item.label }}</div>
        <div v-if="settingStore.tagsViewStyle === item.value" class="style-check">
          <SvgIcon icon="ri:check-line" size="12" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/setting'
import { TagsViewStyleEnum } from '@/enums/theme'

defineOptions({
  name: 'TagsViewStyle'
})

const settingStore = useSettingStore()

const styleList = [
  { label: '卡片', value: TagsViewStyleEnum.CARD },
  { label: '智能', value: TagsViewStyleEnum.SMART },
  { label: 'Chrome', value: TagsViewStyleEnum.CHROME },
  { label: '圆滑', value: TagsViewStyleEnum.SMOOTH },
  { label: '简约', value: TagsViewStyleEnum.MINIMAL },
  { label: '胶囊', value: TagsViewStyleEnum.CAPSULE }
]

const handleSelect = (value: TagsViewStyleEnum) => {
  settingStore.setTagsViewStyle(value)
}

const handleToggle = (value: string | number | boolean) => {
  settingStore.setShowTagsView(value as boolean)
}
</script>

<style lang="scss" scoped>
.setting-item {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__title {
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.style-item {
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
  }

  &.active {
    border-color: var(--el-color-primary);
    background: linear-gradient(
      135deg,
      var(--el-bg-color) 0%,
      var(--el-color-primary-light-9) 100%
    );
    box-shadow: 0 0 0 3px var(--el-color-primary-light-8);

    .style-label {
      color: var(--el-color-primary);
      font-weight: 600;
    }
  }

  .style-preview {
    position: relative;
    z-index: 1;
    width: 100%;
    margin-bottom: 4px;
  }

  .style-label {
    position: relative;
    z-index: 1;
    font-size: 10px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    transition: all 0.3s;
    text-align: center;
    line-height: 1.2;
  }

  .style-check {
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

.preview-tags {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  height: 32px;
  align-items: center;
}

.preview-tag {
  flex: 1;
  height: 16px;
  background: var(--el-fill-color);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  .preview-dot {
    width: 4px;
    height: 4px;
    background: var(--el-text-color-secondary);
    border-radius: 50%;
  }

  &.active {
    background: var(--el-color-primary-light-8);

    .preview-dot {
      background: var(--el-color-primary);
    }
  }
}

// 卡片风格预览
.preview-card {
  .preview-tag {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 2px;
  }
}

// 智能风格预览
.preview-smart {
  .preview-tag {
    border-radius: 2px 2px 0 0;
    position: relative;

    &.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--el-color-primary);
    }
  }
}

// Chrome 风格预览
.preview-chrome {
  gap: 0;

  .preview-tag {
    border-radius: 3px 3px 0 0;
    margin-right: -2px;
    clip-path: polygon(2px 0, calc(100% - 2px) 0, 100% 100%, 0 100%);
  }
}

// 圆滑风格预览
.preview-smooth {
  .preview-tag {
    border-radius: 8px;
  }
}

// 简约风格预览
.preview-minimal {
  background: var(--el-bg-color);

  .preview-tag {
    border-radius: 2px;
    position: relative;

    &.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--el-color-primary);
    }
  }
}

// 胶囊风格预览
.preview-capsule {
  background: linear-gradient(to bottom, var(--el-fill-color-light), var(--el-bg-color));

  .preview-tag {
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);

    &.active {
      border-color: var(--el-color-primary);
    }
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
</style>

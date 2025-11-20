<template>
  <div v-if="settingStore.showTagsView" :class="['tags-view-container', tagsViewClass]">
    <!-- 左侧导航按钮 -->
    <div v-if="showScrollButtons" class="scroll-button scroll-left" @click="scrollLeft">
      <SvgIcon icon="ri:arrow-left-s-line" size="16" />
    </div>

    <!-- 标签列表 -->
    <div ref="tagsViewWrapperRef" class="tags-view-wrapper" @wheel="handleWheel">
      <TransitionGroup name="tag-list" tag="div" class="tags-view-list">
        <div
          v-for="(tag, index) in tagsViewStore.visitedViews"
          :key="tag.path"
          :class="['tags-view-item', { active: isActive(tag), pinned: tag.pinned }]"
          :draggable="!tag.pinned"
          @click="handleClick(tag)"
          @contextmenu.prevent="openContextMenu(tag, $event)"
          @dragstart="handleDragStart(index, $event)"
          @dragover.prevent="handleDragOver(index, $event)"
          @dragend="handleDragEnd"
          @drop="handleDrop(index)"
        >
          <!-- 固定图标 -->
          <SvgIcon v-if="tag.pinned" icon="ri:pushpin-fill" size="12" class="tag-pin-icon" />

          <!-- 标签图标 -->
          <SvgIcon v-else-if="tag.icon" :icon="tag.icon" size="14" class="tag-icon" />

          <!-- 标签标题 -->
          <span class="tag-title">{{ tag.title }}</span>

          <!-- 关闭按钮 -->
          <span
            v-if="isTagClosable(tag)"
            class="tag-close-wrapper"
            @click.stop.prevent="closeTag(tag)"
          >
            <SvgIcon icon="ri:close-line" size="14" class="tag-close" />
          </span>
        </div>
      </TransitionGroup>
    </div>

    <!-- 右侧导航按钮 -->
    <div v-if="showScrollButtons" class="scroll-button scroll-right" @click="scrollRight">
      <SvgIcon icon="ri:arrow-right-s-line" size="16" />
    </div>

    <!-- 操作下拉菜单 -->
    <el-dropdown class="tags-view-actions" trigger="click" @command="handleCommand">
      <div class="actions-trigger">
        <SvgIcon icon="ri:more-2-fill" size="16" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="refresh">
            <SvgIcon icon="ri:refresh-line" size="14" class="mr-2" />
            刷新当前
          </el-dropdown-item>
          <el-dropdown-item command="close" :disabled="!currentTagClosable">
            <SvgIcon icon="ri:close-line" size="14" class="mr-2" />
            关闭当前
          </el-dropdown-item>
          <el-dropdown-item command="closeOthers" divided>
            <SvgIcon icon="ri:close-circle-line" size="14" class="mr-2" />
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="closeLeft">
            <SvgIcon icon="ri:arrow-left-circle-line" size="14" class="mr-2" />
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="closeRight">
            <SvgIcon icon="ri:arrow-right-circle-line" size="14" class="mr-2" />
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="closeAll" divided>
            <SvgIcon icon="ri:close-circle-fill" size="14" class="mr-2" />
            关闭全部
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <Transition name="context-menu">
        <div
          v-show="contextMenuVisible"
          :style="{ left: contextMenuLeft + 'px', top: contextMenuTop + 'px' }"
          class="context-menu"
        >
          <div class="context-menu-item" @click="refreshTag">
            <SvgIcon icon="ri:refresh-line" size="14" />
            <span>刷新</span>
          </div>
          <div v-if="selectedTag && !selectedTag.pinned" class="context-menu-item" @click="pinTag">
            <SvgIcon icon="ri:pushpin-line" size="14" />
            <span>固定</span>
          </div>
          <div v-else class="context-menu-item" @click="unpinTag">
            <SvgIcon icon="ri:unpin-line" size="14" />
            <span>取消固定</span>
          </div>
          <div class="context-menu-divider"></div>
          <div
            class="context-menu-item"
            :class="{ disabled: !isSelectedTagClosable }"
            @click="closeCurrentTag"
          >
            <SvgIcon icon="ri:close-line" size="14" />
            <span>关闭</span>
          </div>
          <div class="context-menu-item" @click="closeOthersTags">
            <SvgIcon icon="ri:close-circle-line" size="14" />
            <span>关闭其他</span>
          </div>
          <div class="context-menu-item" @click="closeLeftTags">
            <SvgIcon icon="ri:arrow-left-circle-line" size="14" />
            <span>关闭左侧</span>
          </div>
          <div class="context-menu-item" @click="closeRightTags">
            <SvgIcon icon="ri:arrow-right-circle-line" size="14" />
            <span>关闭右侧</span>
          </div>
          <div class="context-menu-divider"></div>
          <div class="context-menu-item" @click="closeAllTags">
            <SvgIcon icon="ri:close-circle-fill" size="14" />
            <span>关闭全部</span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { useTagsViewStore, type TagView } from '@/stores/modules/tagsView'
import { useSettingStore } from '@/stores/modules/setting'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'TagsView'
})

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const settingStore = useSettingStore()

const contextMenuVisible = ref(false)
const contextMenuLeft = ref(0)
const contextMenuTop = ref(0)
const selectedTag = ref<TagView | null>(null)
const tagsViewWrapperRef = ref<HTMLElement | null>(null)
const showScrollButtons = ref(false)
const dragFromIndex = ref<number | null>(null)

const tagsViewClass = computed(() => {
  return `tags-view-${settingStore.tagsViewStyle}`
})

const isActive = (tag: TagView) => {
  return tag.path === route.path
}

const currentTagClosable = computed(() => {
  const currentTag = tagsViewStore.visitedViews.find((tag) => tag.path === route.path)
  return currentTag ? isTagClosable(currentTag) : false
})

const isSelectedTagClosable = computed(() => {
  return selectedTag.value ? isTagClosable(selectedTag.value) : false
})

const handleClick = (tag: TagView) => {
  router.push(tag.path)
}

// 判断标签是否可关闭
const isTagClosable = (tag: TagView) => {
  if (!tag.closable || tag.pinned) return false
  return tagsViewStore.visitedViews.length > 1
}

const closeTag = (tag: TagView) => {
  if (tagsViewStore.visitedViews.length === 1) {
    router.push('/welcome')
    return
  }

  tagsViewStore.delView(tag)

  if (isActive(tag)) {
    toLastView()
  }
}

const toLastView = () => {
  const latestView = tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

const openContextMenu = (tag: TagView, e: MouseEvent) => {
  selectedTag.value = tag
  contextMenuVisible.value = true
  contextMenuLeft.value = e.clientX
  contextMenuTop.value = e.clientY
}

const closeContextMenu = () => {
  contextMenuVisible.value = false
}

const refreshTag = () => {
  if (selectedTag.value) {
    router.replace({
      path: '/redirect' + selectedTag.value.path
    })
  }
  closeContextMenu()
}

const pinTag = () => {
  if (selectedTag.value) {
    tagsViewStore.pinView(selectedTag.value)
  }
  closeContextMenu()
}

const unpinTag = () => {
  if (selectedTag.value) {
    tagsViewStore.unpinView(selectedTag.value)
  }
  closeContextMenu()
}

const closeCurrentTag = () => {
  if (selectedTag.value && isTagClosable(selectedTag.value)) {
    if (tagsViewStore.visitedViews.length === 1) {
      router.push('/welcome')
    } else {
      closeTag(selectedTag.value)
    }
  }
  closeContextMenu()
}

const closeOthersTags = () => {
  if (selectedTag.value) {
    tagsViewStore.delOthersViews(selectedTag.value)
    if (!isActive(selectedTag.value)) {
      router.push(selectedTag.value.path)
    }
  }
  closeContextMenu()
}

const closeLeftTags = () => {
  if (selectedTag.value) {
    tagsViewStore.delLeftViews(selectedTag.value)
  }
  closeContextMenu()
}

const closeRightTags = () => {
  if (selectedTag.value) {
    tagsViewStore.delRightViews(selectedTag.value)
  }
  closeContextMenu()
}

const closeAllTags = () => {
  tagsViewStore.delAllViews()
  router.push('/welcome')
  closeContextMenu()
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  const currentTag = tagsViewStore.visitedViews.find((tag) => tag.path === route.path)
  if (!currentTag) return

  switch (command) {
    case 'refresh':
      router.replace({
        path: '/redirect' + currentTag.path
      })
      break
    case 'close':
      if (tagsViewStore.visitedViews.length === 1) {
        router.push('/welcome')
      } else {
        closeTag(currentTag)
      }
      break
    case 'closeOthers':
      tagsViewStore.delOthersViews(currentTag)
      if (!isActive(currentTag)) {
        router.push(currentTag.path)
      }
      break
    case 'closeLeft':
      tagsViewStore.delLeftViews(currentTag)
      break
    case 'closeRight':
      tagsViewStore.delRightViews(currentTag)
      break
    case 'closeAll':
      tagsViewStore.delAllViews()
      router.push('/welcome')
      break
  }
}

// 滚动到激活的标签
const scrollToActiveTag = () => {
  nextTick(() => {
    if (!tagsViewWrapperRef.value) return
    const activeTag = tagsViewWrapperRef.value.querySelector(
      '.tags-view-item.active'
    ) as HTMLElement
    if (activeTag) {
      const container = tagsViewWrapperRef.value
      const containerWidth = container.offsetWidth
      const tagOffsetLeft = activeTag.offsetLeft
      const tagWidth = activeTag.offsetWidth

      const scrollLeft = tagOffsetLeft - containerWidth / 2 + tagWidth / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  })
}

// 处理滚轮事件
const handleWheel = (e: WheelEvent) => {
  if (!tagsViewWrapperRef.value) return
  e.preventDefault()
  const delta = e.deltaY || e.deltaX
  tagsViewWrapperRef.value.scrollLeft += delta
}

// 滚动按钮
const scrollLeft = () => {
  if (!tagsViewWrapperRef.value) return
  tagsViewWrapperRef.value.scrollBy({
    left: -200,
    behavior: 'smooth'
  })
}

const scrollRight = () => {
  if (!tagsViewWrapperRef.value) return
  tagsViewWrapperRef.value.scrollBy({
    left: 200,
    behavior: 'smooth'
  })
}

// 检查是否需要显示滚动按钮
const checkScrollButtons = () => {
  if (!tagsViewWrapperRef.value) return
  const { scrollWidth, clientWidth } = tagsViewWrapperRef.value
  showScrollButtons.value = scrollWidth > clientWidth
}

// 拖拽排序
const handleDragStart = (index: number, e: DragEvent) => {
  dragFromIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (index: number, e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (toIndex: number) => {
  if (dragFromIndex.value !== null && dragFromIndex.value !== toIndex) {
    tagsViewStore.reorderViews(dragFromIndex.value, toIndex)
  }
}

const handleDragEnd = () => {
  dragFromIndex.value = null
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    tagsViewStore.addView(route)
    scrollToActiveTag()
    nextTick(checkScrollButtons)
  },
  { immediate: true }
)

// 监听标签变化
watch(
  () => tagsViewStore.visitedViews.length,
  () => {
    nextTick(checkScrollButtons)
  }
)

onMounted(() => {
  document.addEventListener('click', closeContextMenu)
  if (tagsViewWrapperRef.value) {
    tagsViewWrapperRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
  checkScrollButtons()

  // 监听窗口大小变化
  window.addEventListener('resize', checkScrollButtons)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeContextMenu)
  if (tagsViewWrapperRef.value) {
    tagsViewWrapperRef.value.removeEventListener('wheel', handleWheel)
  }
  window.removeEventListener('resize', checkScrollButtons)
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  align-items: center;
  position: relative;
}

.scroll-button {
  flex-shrink: 0;
  width: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--el-text-color-regular);
  transition: all 0.3s;
  z-index: 10;

  &:hover {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }

  &.scroll-left {
    border-right: 1px solid var(--el-border-color-lighter);
  }

  &.scroll-right {
    border-left: 1px solid var(--el-border-color-lighter);
  }
}

.tags-view-actions {
  flex-shrink: 0;
  padding: 0 12px;
  border-left: 1px solid var(--el-border-color-lighter);
  height: 100%;
  display: flex;
  align-items: center;

  .actions-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: all 0.3s;

    &:hover {
      background: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }
  }
}

.tags-view-wrapper {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color-light);
    border-radius: 2px;
    transition: background 0.3s;

    &:hover {
      background: var(--el-border-color);
    }
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.tags-view-list {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 20px;
  min-width: min-content;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  .tag-pin-icon {
    color: var(--el-color-primary);
  }

  .tag-close-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: var(--el-color-primary-light-9);

      .tag-close {
        color: var(--el-color-primary);
      }
    }
  }

  .tag-close {
    pointer-events: none;
    color: var(--el-text-color-secondary);
  }
}

// 标签列表过渡动画
.tag-list-move {
  transition: transform 0.3s ease;
}

.tag-list-enter-active {
  transition: all 0.3s ease;
}

.tag-list-leave-active {
  transition: all 0.2s ease;
  position: absolute;
}

.tag-list-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.8);
}

.tag-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes pinPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* ==================== 卡片风格 ==================== */
.tags-view-card {
  .tags-view-item {
    border: 1px solid var(--el-color-info-light-7);
    border-radius: 6px;
    color: var(--el-color-info);

    &:hover {
      color: var(--el-color-primary);
    }

    &.active {
      color: var(--el-color-primary);
    }
  }
}

/* ==================== 智能风格 ==================== */
.tags-view-smart {
  .tags-view-item {
    border-radius: 8px 8px 0 0;
    color: var(--el-text-color-regular);
    position: relative;
    padding-bottom: 8px;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: var(--el-color-primary);
      border-radius: 3px 3px 0 0;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      background: var(--el-fill-color-lighter);
      color: var(--el-text-color-primary);

      &::before {
        width: 60%;
      }
    }

    &.active {
      background: var(--el-bg-color);
      color: var(--el-color-primary);

      &::before {
        width: 100%;
        height: 2px;
      }
    }

    &.pinned::after {
      content: '';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 6px;
      height: 6px;
      background: var(--el-color-primary);
      border-radius: 50%;
    }
  }
}

/* ==================== Chrome 风格 ==================== */
.tags-view-chrome {
  .tags-view-wrapper {
    .tags-view-list {
      gap: 2px;
      padding-top: 4px;
    }
  }

  .tags-view-item {
    border-radius: 10px 10px 0 0;
    background: var(--el-fill-color);
    color: var(--el-text-color-regular);
    position: relative;
    padding: 6px 16px;
    margin-right: -6px;
    clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
    box-shadow: inset 0 -1px 0 var(--el-border-color-lighter);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 10px;
      background: linear-gradient(to right, transparent, var(--el-fill-color));
    }

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 10px;
      background: linear-gradient(to left, transparent, var(--el-fill-color));
    }

    &:hover {
      background: var(--el-fill-color-lighter);
      z-index: 1;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);

      &::before {
        background: linear-gradient(to right, transparent, var(--el-fill-color-lighter));
      }

      &::after {
        background: linear-gradient(to left, transparent, var(--el-fill-color-lighter));
      }
    }

    &.active {
      background: var(--el-bg-color);
      color: var(--el-color-primary);
      z-index: 2;
      font-weight: 600;
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);

      &::before {
        background: linear-gradient(to right, transparent, var(--el-bg-color));
      }

      &::after {
        background: linear-gradient(to left, transparent, var(--el-bg-color));
      }
    }

    &.pinned {
      background: var(--el-color-primary-light-9);

      &::before {
        background: linear-gradient(to right, transparent, var(--el-color-primary-light-9));
      }

      &::after {
        background: linear-gradient(to left, transparent, var(--el-color-primary-light-9));
      }
    }
  }
}

/* ==================== 圆滑风格 ==================== */
.tags-view-smooth {
  .tags-view-item {
    border-radius: 20px;
    background: var(--el-fill-color);
    color: var(--el-text-color-regular);
    padding: 6px 14px;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, var(--el-color-primary-light-9));
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      background: var(--el-fill-color-lighter);
      border-color: var(--el-color-primary-light-7);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      &::before {
        opacity: 1;
      }
    }

    &.active {
      background: linear-gradient(
        135deg,
        var(--el-color-primary-light-9) 0%,
        var(--el-color-primary-light-8) 100%
      );
      color: var(--el-color-primary);
      border-color: var(--el-color-primary-light-6);
      font-weight: 600;
      box-shadow: 0 2px 12px rgba(var(--el-color-primary-rgb), 0.15);

      &::before {
        opacity: 0;
      }
    }

    &.pinned {
      border-color: var(--el-color-primary-light-7);
      background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-fill-color));
    }
  }
}

/* ==================== 简约风格 ==================== */
.tags-view-minimal {
  border-bottom: 1px solid var(--el-border-color-light);

  .tags-view-item {
    border-radius: 4px;
    background: transparent;
    color: var(--el-text-color-regular);
    padding: 6px 12px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: var(--el-color-primary);
      transform: scaleX(0);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      background: var(--el-fill-color-lighter);
      color: var(--el-text-color-primary);

      &::after {
        transform: scaleX(0.6);
      }
    }

    &.active {
      background: var(--el-fill-color-light);
      color: var(--el-color-primary);

      &::after {
        transform: scaleX(1);
      }
    }

    &.pinned {
      background: var(--el-fill-color-lighter);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 2px;
        height: 100%;
        background: var(--el-color-primary);
      }
    }
  }
}

/* ==================== 胶囊风格 ==================== */
.tags-view-capsule {
  padding: 4px 0;

  .tags-view-item {
    border-radius: 16px;
    background: var(--el-bg-color);
    color: var(--el-text-color-regular);
    padding: 6px 14px;
    border: 2px solid var(--el-border-color-lighter);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: -50%;
      background: conic-gradient(
        from 0deg,
        transparent,
        var(--el-color-primary-light-9),
        transparent
      );
      opacity: 0;
      transition: opacity 0.5s;
      animation: rotate 3s linear infinite;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 2px;
      background: var(--el-bg-color);
      border-radius: 14px;
      z-index: 0;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    &:hover {
      border-color: var(--el-color-primary-light-6);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      &::before {
        opacity: 1;
      }
    }

    &.active {
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
      border-color: var(--el-color-primary);
      color: white;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(var(--el-color-primary-rgb), 0.3);

      &::after {
        background: linear-gradient(
          135deg,
          var(--el-color-primary),
          var(--el-color-primary-light-3)
        );
      }

      .tag-close {
        color: rgba(255, 255, 255, 0.8);
      }

      .tag-close-wrapper:hover {
        background: rgba(255, 255, 255, 0.25);

        .tag-close {
          color: white;
        }
      }
    }

    &.pinned {
      border-color: var(--el-color-primary-light-5);
      background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-bg-color));

      &::after {
        background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-bg-color));
      }
    }
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== 右键菜单 ==================== */
.context-menu {
  position: fixed;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 6px;
  z-index: 3000;
  backdrop-filter: blur(10px);
  min-width: 140px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.context-menu-divider {
  height: 1px;
  background: var(--el-border-color-lighter);
  margin: 4px 0;
}

.context-menu-enter-active,
.context-menu-leave-active {
  transition: all 0.2s ease;
}

.context-menu-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

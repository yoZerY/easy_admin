<template>
  <div>
    <div
      class="h-15 border-b border-solid border-(--el-color-info-light-7) flex items-center justify-between"
    >
      <div v-if="isVerticalMenu" @click="settingStore.setMenuCollapse()">
        <el-icon><DArrowRight v-if="settingStore.menuCollapse" /> <DArrowLeft v-else /></el-icon>
      </div>
      <HorizontalMenu v-if="isHorizontalMenu"></HorizontalMenu>
      <el-button type="primary" @click="emitter.emit('openSettingPanel')"
        >openSettingPanel</el-button
      >
    </div>
    <TagsView></TagsView>
  </div>
</template>
<script lang="ts" setup>
import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
import { emitter } from '@/utils/mitt'
import TagsView from '../TagsView/index.vue'
import HorizontalMenu from '../MenuBar/HorizontalMenu/index.vue'
import { useSettingStore } from '@/stores/modules/setting'
import { LayoutTypeEnum } from '@/enums'
import { computed } from 'vue'
const settingStore = useSettingStore()
defineOptions({
  name: 'HeaderBar'
})

const isHorizontalMenu = computed(() => settingStore.layoutType === LayoutTypeEnum.HORIZONTAL)
const isVerticalMenu = computed(() => settingStore.layoutType === LayoutTypeEnum.VERTICAL)
</script>
<style lang="scss" scoped></style>

<template>
  <el-divider content-position="center">布局类型</el-divider>
  <el-segmented
    v-model="settingStore.layoutType"
    :options="options"
    block
    size="large"
    @change="(v) => settingStore.setLayoutType(v)"
  >
    <template #default="{ item }">
      <div class="flex items-center justify-center">
        <span>{{ item.label }}</span>
      </div>
    </template>
  </el-segmented>
</template>
<script lang="ts" setup>
import { LayoutTypeEnum } from '@/enums'
import { useSettingStore } from '@/stores/modules/setting'

defineOptions({
  name: 'LayoutType'
})
const settingStore = useSettingStore()
const options = [
  {
    label: '垂直',
    value: LayoutTypeEnum.VERTICAL
  },
  {
    label: '水平',
    value: LayoutTypeEnum.HORIZONTAL
  },
  {
    label: '混合',
    value: LayoutTypeEnum.MIXED
  },
  {
    label: '双列',
    value: LayoutTypeEnum.COLUMNS
  }
]
</script>
<style lang="scss" scoped></style>

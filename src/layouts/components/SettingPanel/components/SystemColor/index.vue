<template>
  <el-divider content-position="center">系统颜色</el-divider>
  <div class="grid grid-cols-8 gap-4">
    <div
      v-for="(color, index) in PRESET_COLOR"
      :style="{ backgroundColor: color }"
      :key="index"
      class="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer hover:scale-110"
      @click="settingStore.setPrimaryColor(color)"
    >
      <el-icon v-if="color === settingStore.primaryColor" size="16" color="#fff">
        <Select />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PRESET_COLOR } from '@/constants/index'
import { useSettingStore } from '@/stores/modules/setting'
import { Select } from '@element-plus/icons-vue'
defineOptions({
  name: 'SystemColor'
})
const settingStore = useSettingStore()
</script>
<style lang="scss" scoped></style>

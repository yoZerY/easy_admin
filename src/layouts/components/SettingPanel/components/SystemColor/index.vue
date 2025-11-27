<template>
  <el-divider content-position="center">系统颜色</el-divider>

  <!-- 主题色 -->
  <div class="mb-4">
    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">主题色</div>
    <div class="grid grid-cols-8 gap-4">
      <div
        v-for="(color, index) in PRESET_COLOR"
        :style="{ backgroundColor: color }"
        :key="index"
        class="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer hover:scale-110"
        @click="settingStore.setPrimaryColor(color)"
      >
        <el-icon v-if="color === settingStore.themeColors.primary" size="16" color="#fff">
          <Select />
        </el-icon>
      </div>
    </div>
  </div>

  <!-- 成功色 -->
  <div class="mb-4">
    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">成功色</div>
    <div class="grid grid-cols-8 gap-4">
      <div
        v-for="(color, index) in SUCCESS_COLORS"
        :style="{ backgroundColor: color }"
        :key="index"
        class="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer hover:scale-110"
        @click="settingStore.setSuccessColor(color)"
      >
        <el-icon v-if="color === settingStore.themeColors.success" size="16" color="#fff">
          <Select />
        </el-icon>
      </div>
    </div>
  </div>

  <!-- 警告色 -->
  <div class="mb-4">
    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">警告色</div>
    <div class="grid grid-cols-8 gap-4">
      <div
        v-for="(color, index) in WARNING_COLORS"
        :style="{ backgroundColor: color }"
        :key="index"
        class="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer hover:scale-110"
        @click="settingStore.setWarningColor(color)"
      >
        <el-icon v-if="color === settingStore.themeColors.warning" size="16" color="#fff">
          <Select />
        </el-icon>
      </div>
    </div>
  </div>

  <!-- 危险色 -->
  <div class="mb-4">
    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">危险色</div>
    <div class="grid grid-cols-8 gap-4">
      <div
        v-for="(color, index) in DANGER_COLORS"
        :style="{ backgroundColor: color }"
        :key="index"
        class="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer hover:scale-110"
        @click="settingStore.setDangerColor(color)"
      >
        <el-icon v-if="color === settingStore.themeColors.danger" size="16" color="#fff">
          <Select />
        </el-icon>
      </div>
    </div>
  </div>

  <!-- 信息色 -->
  <div class="mb-4">
    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">信息色</div>
    <div class="grid grid-cols-8 gap-4">
      <div
        v-for="(color, index) in INFO_COLORS"
        :style="{ backgroundColor: color }"
        :key="index"
        class="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer hover:scale-110"
        @click="settingStore.setInfoColor(color)"
      >
        <el-icon v-if="color === settingStore.themeColors.info" size="16" color="#fff">
          <Select />
        </el-icon>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PRESET_COLOR } from '@/config/setting'
import { useSettingStore } from '@/stores/modules/setting'
import { Select } from '@element-plus/icons-vue'

defineOptions({
  name: 'SystemColor'
})

const settingStore = useSettingStore()

// 成功色预设 - 从亮到深
const SUCCESS_COLORS = [
  '#67c23a', // Element Plus 默认
  '#84cc16', // 亮黄绿
  '#22c55e', // 绿色
  '#10b981', // 翠绿
  '#16a34a', // 深绿
  '#059669', // 深翠绿
  '#14b8a6', // 青绿
  '#65a30d' // 深黄绿
]

// 警告色预设 - 从黄到橙到深
const WARNING_COLORS = [
  '#e6a23c', // Element Plus 默认
  '#eab308', // 黄色
  '#f59e0b', // 琥珀
  '#fb923c', // 亮橙
  '#f97316', // 橙色
  '#ea580c', // 深橙
  '#d97706', // 深琥珀
  '#ca8a04' // 深黄
]

// 危险色预设 - 从亮到深
const DANGER_COLORS = [
  '#f56c6c', // Element Plus 默认
  '#fb7185', // 亮玫瑰
  '#ff6b6b', // 亮红
  '#f43f5e', // 玫瑰
  '#ef4444', // 红色
  '#e11d48', // 深玫瑰
  '#dc2626', // 深红
  '#c2410c' // 深橙红
]

// 信息色预设 - 从浅到深
const INFO_COLORS = [
  '#909399', // Element Plus 默认
  '#94a3b8', // 亮灰蓝
  '#78716c', // 石灰
  '#71717a', // 锌灰
  '#6b7280', // 灰色
  '#64748b', // 板岩
  '#52525b', // 深锌灰
  '#475569' // 深板岩
]
</script>
<style lang="scss" scoped></style>

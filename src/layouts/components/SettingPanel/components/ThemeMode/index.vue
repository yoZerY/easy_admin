<template>
  <el-divider content-position="center">主题切换</el-divider>
  <el-segmented
    v-model="settingStore.themeMode"
    :options="options"
    block
    size="large"
    @change="(v) => settingStore.setThemeMode(v)"
  >
    <template #default="{ item }">
      <div class="flex items-center justify-center gap-2">
        <el-icon size="18">
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.label }}</span>
      </div>
    </template>
  </el-segmented>
</template>
<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/setting'
import { Sunny, Moon, Monitor } from '@element-plus/icons-vue'

defineOptions({
  name: 'SettingThemeMode'
})
const settingStore = useSettingStore()
const options = [
  {
    label: 'light',
    value: 'light',
    icon: Sunny
  },
  {
    label: 'dark',
    value: 'dark',
    icon: Moon
  },
  {
    label: 'auto',
    value: 'auto',
    icon: Monitor
  }
]
</script>
<style lang="scss" scoped></style>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import plusZhCn from 'plus-pro-components/es/locale/lang/zh-cn'
import plusEn from 'plus-pro-components/es/locale/lang/en'
import { useSettingStore } from './stores/modules/setting'

const settingStore = useSettingStore()

const zhCnLocales = {
  ...zhCn,
  ...plusZhCn
}
const enLocales = {
  ...en,
  ...plusEn
}
const locale = {
  zhCnLocales,
  enLocales
}
onBeforeMount(() => {
  settingStore.initTheme()
})
</script>

<template>
  <el-config-provider :locale="locale.zhCnLocales">
    <RouterView></RouterView>
  </el-config-provider>
</template>

<style scoped></style>

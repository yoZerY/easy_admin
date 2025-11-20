<template>
  <el-config-provider :locale="locale.cn">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useSettingStore } from './stores/modules/setting'

const locale = {
  cn: { ...zhCn },
  en: { ...en }
}

onBeforeMount(() => {
  useSettingStore().initTheme()
})
</script>
<style lang="scss" scoped></style>

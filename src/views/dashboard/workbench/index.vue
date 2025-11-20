<template>
  <div ref="tempRef">DashboardWorkbench</div>
</template>

<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
defineOptions({
  name: 'DashboardWorkbench'
})
const tempRef = useTemplateRef('tempRef')
const { height } = useElementSize(tempRef)
onMounted(() => {
  console.log('height :>> ', height.value)
})
</script>

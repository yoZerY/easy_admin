<template>
  <div ref="aaa">
    <div v-for="i in 100" :key="i">{{ i }}analysis</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
defineOptions({
  name: 'DashboardAnalysis'
})
const tempRef = useTemplateRef('aaa')
const { height } = useElementSize(tempRef)

onMounted(() => {
  console.log('height :>> ', height.value)
})
</script>

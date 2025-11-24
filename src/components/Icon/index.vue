<template>
  <Icon :icon="icon" v-bind="bindAttrs" class="svg-icon"> </Icon>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Icon } from '@iconify/vue'
defineOptions({
  name: 'SvgIcon',
  inheritAttrs: false
})

interface Props {
  icon: string
}
defineProps<Props>()

const attrs = useAttrs()
const bindAttrs = computed(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || ''
}))
</script>

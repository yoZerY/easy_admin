<!-- 按钮组件 -->
<template>
  <div
    class="size-8 flex items-center justify-center text-xl rounded hover:bg-gray-100"
    :class="{ 'rounded-full': circle }"
  >
    <SvgIcon :icon="icon"></SvgIcon>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'IconButton' })

interface Props {
  /** 图标名称 */
  icon: string
  /** 圆角按钮 */
  circle?: boolean
}

withDefaults(defineProps<Props>(), {})
</script>

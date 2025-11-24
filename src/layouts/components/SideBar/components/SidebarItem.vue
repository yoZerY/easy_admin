<template>
  <template v-if="!item.meta?.hiddenTag && hasPermission">
    <!-- 只有一个子菜单且不显示父级 -->
    <template v-if="hasOneShowingChild && !alwaysShowRoot && onlyOneChild">
      <el-menu-item :index="resolvePath(onlyOneChild.path)">
        <SvgIcon v-if="onlyOneChild.meta?.icon" :icon="onlyOneChild.meta.icon" />
        <template #title>
          <span>{{ onlyOneChild.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有多个子菜单或需要显示父级 -->
    <el-sub-menu v-else-if="showingChildren.length > 0" :index="resolvePath(item.path)">
      <template #title>
        <SvgIcon v-if="item.meta?.icon" :icon="item.meta.icon" />
        <span>{{ item.meta?.title }}</span>
      </template>

      <sidebar-item
        v-for="child in showingChildren"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(item.path)"
      />
    </el-sub-menu>

    <!-- 没有子菜单的叶子节点 -->
    <el-menu-item v-else :index="resolvePath(item.path)">
      <SvgIcon v-if="item.meta?.icon" :icon="item.meta.icon" />
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import { hasAuth, hasRole } from '@/utils/auth'

defineOptions({
  name: 'SidebarItem'
})

interface Props {
  item: RouteRecordRaw
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: ''
})

// 判断是否有权限
const hasPermission = computed(() => {
  const { meta } = props.item

  // 如果没有配置权限，默认显示
  if (!meta?.roles && !meta?.auths) return true

  // 检查角色权限
  if (meta.roles && !hasRole(meta.roles)) return false

  // 检查操作权限
  if (meta.auths && !hasAuth(meta.auths)) return false

  return true
})

// 解析路径
const resolvePath = (routePath: string) => {
  if (routePath?.startsWith('/')) {
    return routePath
  }
  return props.basePath ? `${props.basePath}/${routePath}` : `/${routePath}`
}

// 获取可显示的子菜单
const showingChildren = computed(() => {
  if (!props.item.children) return []

  return props.item.children.filter((child) => {
    // 过滤隐藏的菜单
    if (child.meta?.hiddenTag) return false

    // 过滤没有权限的菜单
    if (child.meta?.roles && !hasRole(child.meta.roles)) return false
    if (child.meta?.auths && !hasAuth(child.meta.auths)) return false

    return true
  })
})

// 唯一的子菜单
const onlyOneChild = ref<RouteRecordRaw | null>(null)

// 是否只有一个可显示的子菜单
const hasOneShowingChild = computed(() => {
  const children = showingChildren.value

  // 没有子菜单，当作叶子节点
  if (children.length === 0) {
    onlyOneChild.value = props.item
    return true
  }

  // 只有一个子菜单
  if (children.length === 1) {
    const firstChild = children[0]
    if (firstChild) {
      onlyOneChild.value = firstChild
      return true
    }
  }

  // 多个子菜单
  onlyOneChild.value = null
  return false
})

// 是否总是显示根菜单
const alwaysShowRoot = computed(() => {
  return props.item.meta?.showParent !== false
})
</script>

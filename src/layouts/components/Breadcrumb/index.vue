<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <!-- 首页 -->
      <el-breadcrumb-item :to="{ path: '/' }">
        <div class="breadcrumb-item-content">
          <SvgIcon icon="ri:home-4-line" size="16" />
          <span>首页</span>
        </div>
      </el-breadcrumb-item>

      <!-- 面包屑列表 -->
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
        :to="index === breadcrumbs.length - 1 ? undefined : { path: item.path }"
      >
        <div class="breadcrumb-item-content">
          <SvgIcon v-if="item.icon" :icon="item.icon" size="16" />
          <span>{{ item.title }}</span>
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

defineOptions({
  name: 'BreadcrumbNav'
})

interface BreadcrumbItem {
  path: string
  title: string
  icon?: string
}

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter((item) => {
    // 过滤掉根路径和没有 title 的路由
    return item.meta && item.meta.title && item.path !== '/'
  })

  return matched.map((item) => ({
    path: item.path,
    title: item.meta?.title as string,
    icon: item.meta?.icon as string | undefined
  }))
})
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;

  :deep(.el-breadcrumb) {
    font-size: 14px;
    line-height: 1;

    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--el-text-color-regular);
        font-weight: 500;
        transition: all 0.3s;

        &:hover {
          color: var(--el-color-primary);
        }

        .svg-icon {
          transition: all 0.3s;
        }

        &:hover .svg-icon {
          color: var(--el-color-primary);
          transform: scale(1.1);
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          color: var(--el-text-color-primary);
          font-weight: 600;
          cursor: default;

          &:hover {
            color: var(--el-text-color-primary);
          }

          .svg-icon {
            color: var(--el-color-primary);
          }
        }
      }

      .el-breadcrumb__separator {
        color: var(--el-text-color-placeholder);
        margin: 0 8px;
      }
    }
  }
}

.breadcrumb-item-content {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>

<template>
  <div class="p-6">
    <el-card class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">数据备份</span>
          <el-button type="primary" size="small">立即备份</el-button>
        </div>
      </template>
      <el-table :data="backupList" style="width: 100%">
        <el-table-column prop="name" label="备份名称" />
        <el-table-column prop="size" label="文件大小" />
        <el-table-column prop="time" label="备份时间" />
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button size="small" type="primary" link>下载</el-button>
            <el-button size="small" type="success" link>恢复</el-button>
            <el-button size="small" type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'DataBackupPage'
})

const backupList = [
  { name: 'backup_20240101.sql', size: '12.5 MB', time: '2024-01-01 10:00:00' },
  { name: 'backup_20240102.sql', size: '13.2 MB', time: '2024-01-02 10:00:00' }
]
</script>

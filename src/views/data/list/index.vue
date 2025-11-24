<template>
  <div class="p-6">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">数据列表</span>
          <el-button type="primary" size="small">
            <SvgIcon icon="ri:add-line" class="mr-1" />
            新增数据
          </el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button size="small" type="primary" link>编辑</el-button>
            <el-button size="small" type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'DataListPage'
})

const tableData = [
  { id: 1, name: '数据项1', type: '类型A', status: '正常', createTime: '2024-01-01' },
  { id: 2, name: '数据项2', type: '类型B', status: '正常', createTime: '2024-01-02' },
  { id: 3, name: '数据项3', type: '类型A', status: '异常', createTime: '2024-01-03' }
]
</script>

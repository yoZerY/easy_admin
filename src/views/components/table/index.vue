<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">表格组件</h2>
    <el-card>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="address" label="地址" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ComponentTablePage'
})

const tableData = [
  { date: '2024-01-01', name: '张三', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2024-01-02', name: '李四', address: '上海市普陀区金沙江路 1517 弄' },
  { date: '2024-01-03', name: '王五', address: '上海市普陀区金沙江路 1519 弄' }
]
</script>

<template>
  <div class="p-6">
    <el-card>
      <template #header>
        <span class="text-lg font-semibold">数据导出</span>
      </template>
      <el-form label-width="100px" style="max-width: 600px">
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportFormat">
            <el-radio value="xlsx">Excel (xlsx)</el-radio>
            <el-radio value="csv">CSV</el-radio>
            <el-radio value="json">JSON</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">
            <SvgIcon icon="ri:download-line" class="mr-1" />
            导出数据
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'DataExportPage'
})

const exportFormat = ref('xlsx')
const dateRange = ref<[Date, Date]>()
</script>

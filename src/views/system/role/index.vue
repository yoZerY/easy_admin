<template>
  <div class="role-container">
    <PlusSearch
      v-model="searchForm"
      :columns="searchColumns"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">
        <SvgIcon icon="ri:add-line" class="mr-1" />
        新增角色
      </el-button>
    </div>

    <PlusTable
      v-model:page-info="pageInfo"
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      row-key="id"
      @page-change="handlePageChange"
    >
      <template #table-status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <template #table-operation="{ row }">
        <el-button link type="primary" @click="handleEdit(row as RoleItem)">编辑</el-button>
        <el-button link type="primary" @click="handlePermission()">权限</el-button>
        <el-button link type="danger" @click="handleDelete(row as RoleItem)">删除</el-button>
      </template>
    </PlusTable>

    <!-- 新增/编辑对话框 -->
    <RoleForm
      v-model="formVisible"
      :form-data="currentRow"
      :is-edit="isEdit"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PlusColumn } from 'plus-pro-components'
import RoleForm from './components/RoleForm.vue'

defineOptions({
  name: 'SystemRole'
})

interface RoleItem {
  id: number
  name: string
  code: string
  description: string
  status: number
  createTime: string
}

const loading = ref(false)
const formVisible = ref(false)
const isEdit = ref(false)
const currentRow = ref<Partial<RoleItem>>({})

// 搜索表单
const searchForm = ref({
  name: '',
  status: ''
})

// 搜索配置
const searchColumns: PlusColumn[] = [
  {
    label: '角色名称',
    prop: 'name',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入角色名称'
    }
  },
  {
    label: '状态',
    prop: 'status',
    valueType: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  }
]

// 表格配置
const tableColumns: PlusColumn[] = [
  {
    label: 'ID',
    prop: 'id',
    width: 80
  },
  {
    label: '角色名称',
    prop: 'name',
    minWidth: 150
  },
  {
    label: '角色编码',
    prop: 'code',
    minWidth: 150
  },
  {
    label: '描述',
    prop: 'description',
    minWidth: 200
  },
  {
    label: '状态',
    prop: 'status',
    width: 100
  },
  {
    label: '创建时间',
    prop: 'createTime',
    minWidth: 180
  },
  {
    label: '操作',
    prop: 'operation',
    width: 200,
    fixed: 'right'
  }
]

// 分页信息
const pageInfo = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref<RoleItem[]>([])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: 1,
        name: '超级管理员',
        code: 'admin',
        description: '拥有系统所有权限',
        status: 1,
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        name: '普通用户',
        code: 'user',
        description: '普通用户权限',
        status: 1,
        createTime: '2024-01-02 10:00:00'
      }
    ]
    pageInfo.value.total = 2
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pageInfo.value.page = 1
  getList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    name: '',
    status: ''
  }
  handleSearch()
}

// 分页变化
const handlePageChange = () => {
  getList()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  currentRow.value = {}
  formVisible.value = true
}

// 编辑
const handleEdit = (row: RoleItem) => {
  isEdit.value = true
  currentRow.value = { ...row }
  formVisible.value = true
}

// 权限配置
const handlePermission = () => {
  ElMessage.info('权限配置功能开发中...')
}

// 删除
const handleDelete = async (row: RoleItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    getList()
  } catch {
    // 取消删除
  }
}

// 表单提交成功
const handleFormSuccess = () => {
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.role-container {
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
}

.table-toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}
</style>

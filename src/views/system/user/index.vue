<template>
  <div class="user-container">
    <PlusSearch
      v-model="searchForm"
      :columns="searchColumns"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">
        <SvgIcon icon="ri:add-line" class="mr-1" />
        新增用户
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
        <el-button link type="primary" @click="handleEdit(row as UserItem)">编辑</el-button>
        <el-button link type="danger" @click="handleDelete(row as UserItem)">删除</el-button>
      </template>
    </PlusTable>

    <!-- 新增/编辑对话框 -->
    <UserForm
      v-model="formVisible"
      :form-data="currentRow"
      :is-edit="isEdit"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PlusColumn } from 'plus-pro-components'
import UserForm from './components/UserForm.vue'

defineOptions({
  name: 'SystemUser'
})

interface UserItem {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  roleId: number
  roleName: string
  deptId: number
  deptName: string
  status: number
  createTime: string
}

const loading = ref(false)
const formVisible = ref(false)
const isEdit = ref(false)
const currentRow = ref<Partial<UserItem>>({})

// 搜索表单
const searchForm = ref({
  username: '',
  phone: '',
  status: ''
})

// 搜索配置
const searchColumns: PlusColumn[] = [
  {
    label: '用户名',
    prop: 'username',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入用户名'
    }
  },
  {
    label: '手机号',
    prop: 'phone',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入手机号'
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
    label: '用户名',
    prop: 'username',
    minWidth: 120
  },
  {
    label: '昵称',
    prop: 'nickname',
    minWidth: 120
  },
  {
    label: '邮箱',
    prop: 'email',
    minWidth: 180
  },
  {
    label: '手机号',
    prop: 'phone',
    minWidth: 130
  },
  {
    label: '角色',
    prop: 'roleName',
    minWidth: 120
  },
  {
    label: '部门',
    prop: 'deptName',
    minWidth: 120
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
    width: 150,
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
const tableData = ref<UserItem[]>([])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // TODO: 调用实际 API
    // const res = await getUserList({ ...searchForm.value, ...pageInfo.value })
    // tableData.value = res.data.list
    // pageInfo.value.total = res.data.total

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        roleId: 1,
        roleName: '超级管理员',
        deptId: 1,
        deptName: '技术部',
        status: 1,
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        username: 'user',
        nickname: '普通用户',
        email: 'user@example.com',
        phone: '13800138001',
        roleId: 2,
        roleName: '普通用户',
        deptId: 2,
        deptName: '产品部',
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
    username: '',
    phone: '',
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
const handleEdit = (row: UserItem) => {
  isEdit.value = true
  currentRow.value = { ...row }
  formVisible.value = true
}

// 删除
const handleDelete = async (row: UserItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户"${row.username}"吗？`, '提示', {
      type: 'warning'
    })
    // TODO: 调用删除 API
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
.user-container {
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

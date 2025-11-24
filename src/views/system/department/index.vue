<template>
  <div class="dept-container">
    <PlusSearch
      v-model="searchForm"
      :columns="searchColumns"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd()">
        <SvgIcon icon="ri:add-line" class="mr-1" />
        新增部门
      </el-button>
      <el-button @click="toggleExpand">
        <SvgIcon :icon="isExpanded ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" class="mr-1" />
        {{ isExpanded ? '折叠' : '展开' }}
      </el-button>
    </div>

    <PlusTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
    >
      <template #table-status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <template #table-operation="{ row }">
        <el-button link type="primary" @click="handleAdd(row as DeptItem)">新增</el-button>
        <el-button link type="primary" @click="handleEdit(row as DeptItem)">编辑</el-button>
        <el-button link type="danger" @click="handleDelete(row as DeptItem)">删除</el-button>
      </template>
    </PlusTable>

    <!-- 新增/编辑对话框 -->
    <DeptForm
      v-model="formVisible"
      :form-data="currentRow"
      :is-edit="isEdit"
      :dept-tree="tableData"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PlusColumn } from 'plus-pro-components'
import DeptForm from './components/DeptForm.vue'

defineOptions({
  name: 'SystemDept'
})

interface DeptItem {
  id: number
  name: string
  code: string
  parentId: number
  leader: string
  phone: string
  email: string
  sort: number
  status: number
  createTime: string
  children?: DeptItem[]
}

const loading = ref(false)
const formVisible = ref(false)
const isEdit = ref(false)
const isExpanded = ref(true)
const currentRow = ref<Partial<DeptItem>>({})

// 搜索表单
const searchForm = ref({
  name: '',
  status: ''
})

// 搜索配置
const searchColumns: PlusColumn[] = [
  {
    label: '部门名称',
    prop: 'name',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入部门名称'
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
    label: '部门名称',
    prop: 'name',
    minWidth: 200
  },
  {
    label: '部门编码',
    prop: 'code',
    minWidth: 150
  },
  {
    label: '负责人',
    prop: 'leader',
    minWidth: 120
  },
  {
    label: '联系电话',
    prop: 'phone',
    minWidth: 130
  },
  {
    label: '邮箱',
    prop: 'email',
    minWidth: 180
  },
  {
    label: '排序',
    prop: 'sort',
    width: 80
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

// 表格数据
const tableData = ref<DeptItem[]>([])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟树形数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: 1,
        name: '总公司',
        code: 'HQ',
        parentId: 0,
        leader: '张三',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        sort: 1,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: 2,
            name: '技术部',
            code: 'TECH',
            parentId: 1,
            leader: '李四',
            phone: '13800138001',
            email: 'lisi@example.com',
            sort: 1,
            status: 1,
            createTime: '2024-01-02 10:00:00',
            children: [
              {
                id: 4,
                name: '前端组',
                code: 'FE',
                parentId: 2,
                leader: '王五',
                phone: '13800138003',
                email: 'wangwu@example.com',
                sort: 1,
                status: 1,
                createTime: '2024-01-04 10:00:00'
              },
              {
                id: 5,
                name: '后端组',
                code: 'BE',
                parentId: 2,
                leader: '赵六',
                phone: '13800138004',
                email: 'zhaoliu@example.com',
                sort: 2,
                status: 1,
                createTime: '2024-01-05 10:00:00'
              }
            ]
          },
          {
            id: 3,
            name: '产品部',
            code: 'PRODUCT',
            parentId: 1,
            leader: '钱七',
            phone: '13800138002',
            email: 'qianqi@example.com',
            sort: 2,
            status: 1,
            createTime: '2024-01-03 10:00:00'
          }
        ]
      }
    ]
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
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

// 展开/折叠
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  // TODO: 实现展开折叠逻辑
}

// 新增
const handleAdd = (row?: DeptItem) => {
  isEdit.value = false
  currentRow.value = row ? { parentId: row.id } : { parentId: 0 }
  formVisible.value = true
}

// 编辑
const handleEdit = (row: DeptItem) => {
  isEdit.value = true
  currentRow.value = { ...row }
  formVisible.value = true
}

// 删除
const handleDelete = async (row: DeptItem) => {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该部门下有子部门，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除部门"${row.name}"吗？`, '提示', {
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
.dept-container {
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

<template>
  <div class="menu-container">
    <PlusSearch
      v-model="searchForm"
      :columns="searchColumns"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd()">
        <SvgIcon icon="ri:add-line" class="mr-1" />
        新增菜单
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
      <template #table-icon="{ row }">
        <SvgIcon v-if="row.icon" :icon="row.icon" size="18" />
      </template>

      <template #table-type="{ row }">
        <el-tag v-if="row.type === 1" type="primary">目录</el-tag>
        <el-tag v-else-if="row.type === 2" type="success">菜单</el-tag>
        <el-tag v-else type="info">按钮</el-tag>
      </template>

      <template #table-status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '显示' : '隐藏' }}
        </el-tag>
      </template>

      <template #table-operation="{ row }">
        <el-button link type="primary" @click="handleAdd(row as MenuItem)">新增</el-button>
        <el-button link type="primary" @click="handleEdit(row as MenuItem)">编辑</el-button>
        <el-button link type="danger" @click="handleDelete(row as MenuItem)">删除</el-button>
      </template>
    </PlusTable>

    <!-- 新增/编辑对话框 -->
    <MenuForm
      v-model="formVisible"
      :form-data="currentRow"
      :is-edit="isEdit"
      :menu-tree="tableData"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PlusColumn } from 'plus-pro-components'
import MenuForm from './components/MenuForm.vue'

defineOptions({
  name: 'SystemMenu'
})

interface MenuItem {
  id: number
  name: string
  title: string
  path: string
  component: string
  redirect?: string
  icon: string
  type: number
  parentId: number
  permission: string
  roles?: string[]
  sort: number
  rank: number
  status: number
  showLink: boolean
  showParent: boolean
  keepAlive: boolean
  hiddenTag: boolean
  isFrame: boolean
  frameSrc?: string
  isLink?: string
  isAffix: boolean
  remark?: string
  createTime: string
  children?: MenuItem[]
}

const loading = ref(false)
const formVisible = ref(false)
const isEdit = ref(false)
const isExpanded = ref(true)
const currentRow = ref<Partial<MenuItem>>({})

// 搜索表单
const searchForm = ref({
  name: '',
  status: ''
})

// 搜索配置
const searchColumns: PlusColumn[] = [
  {
    label: '菜单名称',
    prop: 'name',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入菜单名称'
    }
  },
  {
    label: '状态',
    prop: 'status',
    valueType: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '显示', value: 1 },
      { label: '隐藏', value: 0 }
    ]
  }
]

// 表格配置
const tableColumns: PlusColumn[] = [
  {
    label: '菜单名称',
    prop: 'name',
    minWidth: 200
  },
  {
    label: '图标',
    prop: 'icon',
    width: 80
  },
  {
    label: '类型',
    prop: 'type',
    width: 100
  },
  {
    label: '路由路径',
    prop: 'path',
    minWidth: 180
  },
  {
    label: '组件路径',
    prop: 'component',
    minWidth: 200
  },
  {
    label: '权限标识',
    prop: 'permission',
    minWidth: 150
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
const tableData = ref<MenuItem[]>([])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟树形数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: 1,
        name: '首页',
        path: '/',
        component: 'Layout',
        icon: 'ri:home-4-line',
        type: 1,
        parentId: 0,
        permission: '',
        sort: 1,
        status: 1,
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: 2,
            name: '欢迎页',
            path: '/welcome',
            component: 'views/welcome/index',
            icon: 'ri:dashboard-line',
            type: 2,
            parentId: 1,
            permission: 'welcome:view',
            sort: 1,
            status: 1,
            createTime: '2024-01-02 10:00:00'
          }
        ]
      },
      {
        id: 3,
        name: '系统管理',
        path: '/system',
        component: 'Layout',
        icon: 'ri:settings-3-line',
        type: 1,
        parentId: 0,
        permission: '',
        sort: 2,
        status: 1,
        createTime: '2024-01-03 10:00:00',
        children: [
          {
            id: 4,
            name: '用户管理',
            path: '/system/user',
            component: 'views/system/user/index',
            icon: 'ri:user-line',
            type: 2,
            parentId: 3,
            permission: 'system:user:view',
            sort: 1,
            status: 1,
            createTime: '2024-01-04 10:00:00',
            children: [
              {
                id: 8,
                name: '新增用户',
                path: '',
                component: '',
                icon: '',
                type: 3,
                parentId: 4,
                permission: 'system:user:add',
                sort: 1,
                status: 1,
                createTime: '2024-01-08 10:00:00'
              },
              {
                id: 9,
                name: '编辑用户',
                path: '',
                component: '',
                icon: '',
                type: 3,
                parentId: 4,
                permission: 'system:user:edit',
                sort: 2,
                status: 1,
                createTime: '2024-01-09 10:00:00'
              },
              {
                id: 10,
                name: '删除用户',
                path: '',
                component: '',
                icon: '',
                type: 3,
                parentId: 4,
                permission: 'system:user:delete',
                sort: 3,
                status: 1,
                createTime: '2024-01-10 10:00:00'
              }
            ]
          },
          {
            id: 5,
            name: '角色管理',
            path: '/system/role',
            component: 'views/system/role/index',
            icon: 'ri:admin-line',
            type: 2,
            parentId: 3,
            permission: 'system:role:view',
            sort: 2,
            status: 1,
            createTime: '2024-01-05 10:00:00'
          },
          {
            id: 6,
            name: '菜单管理',
            path: '/system/menu',
            component: 'views/system/menu/index',
            icon: 'ri:menu-line',
            type: 2,
            parentId: 3,
            permission: 'system:menu:view',
            sort: 3,
            status: 1,
            createTime: '2024-01-06 10:00:00'
          },
          {
            id: 7,
            name: '部门管理',
            path: '/system/department',
            component: 'views/system/department/index',
            icon: 'ri:organization-chart',
            type: 2,
            parentId: 3,
            permission: 'system:dept:view',
            sort: 4,
            status: 1,
            createTime: '2024-01-07 10:00:00'
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
const handleAdd = (row?: MenuItem) => {
  isEdit.value = false
  currentRow.value = row
    ? { parentId: row.id, type: row.type === 1 ? 2 : 3 }
    : { parentId: 0, type: 1 }
  formVisible.value = true
}

// 编辑
const handleEdit = (row: MenuItem) => {
  isEdit.value = true
  currentRow.value = { ...row }
  formVisible.value = true
}

// 删除
const handleDelete = async (row: MenuItem) => {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('该菜单下有子菜单，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除菜单"${row.name}"吗？`, '提示', {
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
.menu-container {
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

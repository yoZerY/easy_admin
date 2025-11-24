<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑菜单' : '新增菜单'"
    width="1200px"
    @close="handleClose"
  >
    <PlusForm
      ref="formRef"
      v-model="form"
      :col-props="{
        span: 12
      }"
      :row-props="{
        gutter: 50
      }"
      label-position="right"
      :columns="formColumns"
      :rules="formRules"
      label-width="120px"
    >
      <template #plus-field-type>
        <el-segmented v-model="form.type as number" :options="typeOptions" />
      </template>
    </PlusForm>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { PlusColumn, FieldValues } from 'plus-pro-components'
import type { FormRules } from 'element-plus'
import { getComponentOptions } from '@/utils/component-scanner'

defineOptions({
  name: 'MenuForm'
})

interface Props {
  modelValue: boolean
  formData?: Record<string, unknown>
  isEdit?: boolean
  menuTree?: Record<string, unknown>[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  formData: () => ({}),
  isEdit: false,
  menuTree: () => []
})

const emit = defineEmits<Emits>()

const formRef = ref()
const submitLoading = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Segmented 选项（菜单类型）
const typeOptions = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 },
  { label: 'iframe', value: 4 },
  { label: '外链', value: 5 }
]

// 表单数据
const form = ref<FieldValues>({
  name: '',
  type: 1,
  parentId: 0,
  path: '',
  component: '',
  redirect: '',
  icon: '',
  title: '',
  permission: '',
  roles: [],
  sort: 0,
  rank: 999,
  status: 1,
  showLink: true,
  showParent: true,
  keepAlive: true,
  hiddenTag: false,
  isFrame: false,
  frameUrl: '',
  frameSrc: '',
  isAffix: false,
  isLink: '',
  remark: ''
})

// 转换菜单树为选项
const menuOptions = computed(() => {
  const options = [{ label: '顶级菜单', value: 0 }]
  const convertTree = (tree: Record<string, unknown>[], level = 0) => {
    tree.forEach((item) => {
      // 只显示目录和菜单，不显示按钮
      if (item.type !== 3) {
        options.push({
          label: '　'.repeat(level) + item.name,
          value: item.id
        })
        if (item.children && item.children.length > 0) {
          convertTree(item.children, level + 1)
        }
      }
    })
  }
  convertTree(props.menuTree)
  return options
})

// 获取组件路径选项
const componentOptions = computed(() => {
  const options = getComponentOptions()

  // 直接返回扁平化的选项列表，显示组件路径
  return options.map((item) => ({
    label: item.value, // 显示组件路径
    value: item.value
  }))
})

// 表单配置
const formColumns = computed<PlusColumn[]>(() => {
  return [
    // 基础信息
    {
      label: '菜单类型',
      prop: 'type',
      defaultValue: 1
    },
    {
      label: '上级菜单',
      prop: 'parentId',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择上级菜单'
      },
      options: menuOptions,
      hideInForm: form.value.type === 1,
      defaultValue: 0
    },
    {
      label: '菜单名称',
      prop: 'name',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入菜单名称（路由 name）',
        clearable: true
      },
      defaultValue: ''
    },
    {
      label: '菜单标题',
      prop: 'title',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入菜单标题',
        clearable: true
      },
      hideInForm: form.value.type === 3,
      defaultValue: ''
    },
    {
      label: '菜单图标',
      prop: 'icon',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入图标名称，如：ri:home-line',
        clearable: true
      },
      hideInForm: form.value.type === 3,
      defaultValue: ''
    },

    // 路由配置
    {
      label: '路由路径',
      prop: 'path',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入路由路径，如：/system/user',
        clearable: true
      },
      hideInForm: form.value.type === 3 || form.value.type === 5,
      defaultValue: ''
    },
    {
      label: '组件路径',
      prop: 'component',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择组件路径',
        clearable: true,
        filterable: true
      },
      options: componentOptions,
      hideInForm: form.value.type === 3 || form.value.type === 4 || form.value.type === 5,
      defaultValue: ''
    },
    {
      label: '重定向',
      prop: 'redirect',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入重定向路径，如：/system/user',
        clearable: true
      },
      hideInForm: form.value.type !== 1,
      defaultValue: ''
    },

    // 权限配置
    {
      label: '权限标识',
      prop: 'permission',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入权限标识，如：system:user:view',
        clearable: true
      },
      defaultValue: ''
    },
    {
      label: '角色权限',
      prop: 'roles',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择角色权限',
        clearable: true,
        multiple: true
      },
      options: [
        { label: '超级管理员', value: 'admin' },
        { label: '管理员', value: 'manager' },
        { label: '编辑人员', value: 'editor' },
        { label: '普通用户', value: 'user' }
      ],
      defaultValue: []
    },

    // 显示配置
    {
      label: '显示菜单',
      prop: 'showLink',
      valueType: 'switch',
      hideInForm: form.value.type === 3 || form.value.type === 4 || form.value.type === 5,
      defaultValue: true
    },
    {
      label: '显示父级',
      prop: 'showParent',
      valueType: 'switch',
      hideInForm: form.value.type === 3 || form.value.type === 4 || form.value.type === 5,
      defaultValue: true
    },
    {
      label: '隐藏标签',
      prop: 'hiddenTag',
      valueType: 'switch',
      hideInForm: form.value.type === 3 || form.value.type === 4 || form.value.type === 5,
      defaultValue: false
    },
    {
      label: '固定标签',
      prop: 'isAffix',
      valueType: 'switch',
      hideInForm: form.value.type === 3 || form.value.type === 4 || form.value.type === 5,
      defaultValue: false
    },

    // 缓存配置
    {
      label: '页面缓存',
      prop: 'keepAlive',
      valueType: 'switch',
      hideInForm: form.value.type !== 2,
      defaultValue: true
    },

    // iframe 和外链配置
    {
      label: 'iframe 地址',
      prop: 'frameSrc',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入 iframe 地址，如：https://www.baidu.com',
        clearable: true
      },
      hideInForm: form.value.type !== 4,
      defaultValue: ''
    },
    {
      label: '外链地址',
      prop: 'isLink',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入外链地址，如：https://www.google.com',
        clearable: true
      },
      hideInForm: form.value.type !== 5,
      defaultValue: ''
    },

    // 排序配置
    {
      label: '菜单排序',
      prop: 'sort',
      valueType: 'input-number',
      fieldProps: {
        min: 0,
        controlsPosition: 'right'
      },
      defaultValue: 0
    },
    {
      label: '路由排序',
      prop: 'rank',
      valueType: 'input-number',
      fieldProps: {
        min: 0,
        controlsPosition: 'right'
      },
      hideInForm: form.value.type === 3,
      defaultValue: 999
    },

    // 状态和备注
    {
      label: '菜单状态',
      prop: 'status',
      valueType: 'switch',
      fieldProps: {
        activeValue: 1,
        inactiveValue: 0,
        activeText: '显示',
        inactiveText: '隐藏'
      },
      defaultValue: 1
    },
    {
      label: '备注',
      prop: 'remark',
      valueType: 'textarea',
      fieldProps: {
        placeholder: '请输入备注信息',
        rows: 3,
        maxlength: 200,
        showWordLimit: true
      },
      defaultValue: ''
    }
  ] as PlusColumn[]
})

// 表单验证规则
const formRules = computed<FormRules>(() => ({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  title: [
    {
      required: form.value.type !== 3,
      message: '请输入菜单标题',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: form.value.type !== 3 && form.value.type !== 4 && form.value.type !== 5,
      message: '请输入路由路径',
      trigger: 'blur'
    }
  ],
  component: [
    {
      required: form.value.type !== 3 && form.value.type !== 4 && form.value.type !== 5,
      message: '请选择组件路径',
      trigger: 'change'
    }
  ],
  frameSrc: [
    {
      required: form.value.type === 4,
      message: '请输入 iframe 地址',
      trigger: 'blur'
    }
  ],
  isLink: [
    {
      required: form.value.type === 5,
      message: '请输入外链地址',
      trigger: 'blur'
    }
  ],
  permission: [
    {
      required: form.value.type === 3,
      message: '请输入权限标识',
      trigger: 'blur'
    }
  ]
}))

// 监听表单数据变化
watch(
  () => props.formData,
  (val) => {
    if (val && Object.keys(val).length > 0) {
      form.value = { ...val }
    } else {
      form.value = {
        name: '',
        type: 1,
        parentId: 0,
        path: '',
        component: '',
        redirect: '',
        icon: '',
        title: '',
        permission: '',
        roles: [],
        sort: 0,
        rank: 999,
        status: 1,
        showLink: true,
        showParent: true,
        keepAlive: true,
        hiddenTag: false,
        isFrame: false,
        frameUrl: '',
        frameSrc: '',
        isAffix: false,
        isLink: '',
        remark: ''
      }
    }
  },
  { immediate: true, deep: true }
)

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true

    // 模拟请求
    await new Promise((resolve) => setTimeout(resolve, 500))

    ElMessage.success(props.isEdit ? '编辑成功' : '新增成功')
    emit('success')
    handleClose()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:modelValue', false)
}
</script>

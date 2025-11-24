<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑部门' : '新增部门'"
    width="700px"
    @close="handleClose"
  >
    <PlusForm
      ref="formRef"
      v-model="form"
      :columns="formColumns"
      :rules="formRules"
      label-width="100px"
    />

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { PlusColumn, FieldValues } from 'plus-pro-components'
import type { FormRules } from 'element-plus'

defineOptions({
  name: 'DeptForm'
})

interface Props {
  modelValue: boolean
  formData?: Record<string, any>
  isEdit?: boolean
  deptTree?: Record<string, any>[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  formData: () => ({}),
  isEdit: false,
  deptTree: () => []
})

const emit = defineEmits<Emits>()

const formRef = ref()
const submitLoading = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 表单数据
const form = ref<FieldValues>({
  name: '',
  code: '',
  parentId: 0,
  leader: '',
  phone: '',
  email: '',
  address: '',
  sort: 0,
  remark: '',
  status: 1
})

// 转换部门树为选项
const deptOptions = computed(() => {
  const options = [{ label: '顶级部门', value: 0 }]
  const convertTree = (tree: Record<string, any>[], level = 0) => {
    tree.forEach((item) => {
      // 编辑时排除自己和子部门
      if (props.isEdit && form.value.id === item.id) {
        return
      }
      options.push({
        label: '　'.repeat(level) + item.name,
        value: item.id
      })
      if (item.children && item.children.length > 0) {
        convertTree(item.children, level + 1)
      }
    })
  }
  convertTree(props.deptTree)
  return options
})

// 表单配置
const formColumns: PlusColumn[] = [
  {
    label: '上级部门',
    prop: 'parentId',
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择上级部门'
    },
    options: deptOptions,
    tooltip: '选择该部门的上级部门，不选则为顶级部门',
    defaultValue: 0
  },
  {
    label: '部门名称',
    prop: 'name',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入部门名称',
      clearable: true,
      maxlength: 30
    },
    tooltip: '部门的显示名称',
    defaultValue: ''
  },
  {
    label: '部门编码',
    prop: 'code',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入部门编码',
      clearable: true,
      maxlength: 30
    },
    tooltip: '部门的唯一标识码',
    defaultValue: ''
  },
  {
    label: '负责人',
    prop: 'leader',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入负责人姓名',
      clearable: true,
      maxlength: 20
    },
    defaultValue: ''
  },
  {
    label: '联系电话',
    prop: 'phone',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入联系电话',
      clearable: true,
      maxlength: 20
    },
    defaultValue: ''
  },
  {
    label: '邮箱',
    prop: 'email',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入部门邮箱',
      clearable: true,
      maxlength: 50
    },
    defaultValue: ''
  },
  {
    label: '部门地址',
    prop: 'address',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入部门办公地址',
      clearable: true,
      maxlength: 100
    },
    defaultValue: ''
  },
  {
    label: '显示排序',
    prop: 'sort',
    valueType: 'input-number',
    fieldProps: {
      min: 0,
      max: 9999,
      controlsPosition: 'right'
    },
    tooltip: '数字越小越靠前',
    defaultValue: 0
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
  },
  {
    label: '部门状态',
    prop: 'status',
    valueType: 'switch',
    fieldProps: {
      activeValue: 1,
      inactiveValue: 0,
      activeText: '启用',
      inactiveText: '禁用'
    },
    tooltip: '禁用后该部门及其子部门将不可用',
    defaultValue: 1
  }
]

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 30, message: '部门名称长度为2-30个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入部门编码', trigger: 'blur' },
    { min: 2, max: 30, message: '部门编码长度为2-30个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '编码必须以字母开头，只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/,
      message: '请输入正确的电话号码格式',
      trigger: 'blur'
    }
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }]
}

// 监听表单数据变化
watch(
  () => props.formData,
  (val) => {
    if (val && Object.keys(val).length > 0) {
      form.value = { ...val }
    } else {
      form.value = {
        name: '',
        code: '',
        parentId: 0,
        leader: '',
        phone: '',
        email: '',
        address: '',
        sort: 0,
        remark: '',
        status: 1
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

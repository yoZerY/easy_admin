<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑角色' : '新增角色'"
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
  name: 'RoleForm'
})

interface Props {
  modelValue: boolean
  formData?: Record<string, unknown>
  isEdit?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  formData: () => ({}),
  isEdit: false
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
  dataScope: 1,
  sort: 0,
  description: '',
  remark: '',
  status: 1
})

// 表单配置
const formColumns: PlusColumn[] = [
  {
    label: '角色名称',
    prop: 'name',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入角色名称',
      clearable: true,
      maxlength: 30
    },
    tooltip: '角色的显示名称，如：系统管理员',
    defaultValue: ''
  },
  {
    label: '角色编码',
    prop: 'code',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入角色编码',
      clearable: true,
      maxlength: 30
    },
    tooltip: '角色的唯一标识，如：admin、user',
    defaultValue: ''
  },
  {
    label: '数据权限',
    prop: 'dataScope',
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择数据权限范围'
    },
    options: [
      { label: '全部数据权限', value: 1 },
      { label: '自定义数据权限', value: 2 },
      { label: '本部门数据权限', value: 3 },
      { label: '本部门及以下数据权限', value: 4 },
      { label: '仅本人数据权限', value: 5 }
    ],
    tooltip: '控制角色可以查看的数据范围',
    defaultValue: 1
  },
  {
    label: '角色排序',
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
    label: '角色描述',
    prop: 'description',
    valueType: 'textarea',
    fieldProps: {
      placeholder: '请输入角色描述信息',
      rows: 3,
      maxlength: 200,
      showWordLimit: true
    },
    tooltip: '简要说明该角色的职责和权限',
    defaultValue: ''
  },
  {
    label: '备注',
    prop: 'remark',
    valueType: 'textarea',
    fieldProps: {
      placeholder: '请输入备注信息',
      rows: 2,
      maxlength: 200,
      showWordLimit: true
    },
    defaultValue: ''
  },
  {
    label: '角色状态',
    prop: 'status',
    valueType: 'switch',
    fieldProps: {
      activeValue: 1,
      inactiveValue: 0,
      activeText: '启用',
      inactiveText: '禁用'
    },
    tooltip: '禁用后该角色的用户将无法使用相关权限',
    defaultValue: 1
  }
]

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 30, message: '角色名称长度为2-30个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { min: 2, max: 30, message: '角色编码长度为2-30个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '编码必须以字母开头，只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  dataScope: [{ required: true, message: '请选择数据权限范围', trigger: 'change' }]
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
        dataScope: 1,
        sort: 0,
        description: '',
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

<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="900px"
    @close="handleClose"
  >
    <PlusForm
      ref="formRef"
      v-model="form"
      :col-props="{ span: 12 }"
      :row-props="{ gutter: 20 }"
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
  name: 'UserForm'
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
  username: '',
  nickname: '',
  password: '',
  email: '',
  phone: '',
  gender: 1,
  birthday: '',
  avatar: '',
  roleId: undefined,
  deptId: undefined,
  postId: undefined,
  address: '',
  remark: '',
  status: 1
})

// 表单配置
const formColumns: PlusColumn[] = [
  // 基本信息
  {
    label: '用户名',
    prop: 'username',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入用户名（登录账号）',
      clearable: true,
      maxlength: 20
    },
    tooltip: '用于登录系统的唯一标识',
    defaultValue: ''
  },
  {
    label: '昵称',
    prop: 'nickname',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入昵称（显示名称）',
      clearable: true,
      maxlength: 20
    },
    defaultValue: ''
  },
  {
    label: '密码',
    prop: 'password',
    valueType: 'input',
    fieldProps: {
      type: 'password',
      placeholder: props.isEdit ? '不填写则不修改密码' : '请输入密码',
      clearable: true,
      showPassword: true,
      maxlength: 32
    },
    hideInForm: computed(() => props.isEdit),
    tooltip: '密码长度6-32位，建议包含字母、数字和特殊字符',
    defaultValue: ''
  },
  {
    label: '性别',
    prop: 'gender',
    valueType: 'radio',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
      { label: '保密', value: 0 }
    ],
    defaultValue: 1
  },

  // 联系信息
  {
    label: '手机号',
    prop: 'phone',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入手机号',
      clearable: true,
      maxlength: 11
    },
    tooltip: '用于接收系统通知和找回密码',
    defaultValue: ''
  },
  {
    label: '邮箱',
    prop: 'email',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入邮箱地址',
      clearable: true,
      maxlength: 50
    },
    tooltip: '用于接收系统邮件通知',
    defaultValue: ''
  },
  {
    label: '生日',
    prop: 'birthday',
    valueType: 'date-picker',
    fieldProps: {
      placeholder: '请选择生日',
      clearable: true,
      type: 'date',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    },
    defaultValue: ''
  },
  {
    label: '地址',
    prop: 'address',
    valueType: 'input',
    fieldProps: {
      placeholder: '请输入联系地址',
      clearable: true,
      maxlength: 100
    },
    colProps: { span: 24 },
    defaultValue: ''
  },

  // 组织信息
  {
    label: '所属角色',
    prop: 'roleId',
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择用户角色',
      clearable: true
    },
    options: [
      { label: '超级管理员', value: 1 },
      { label: '管理员', value: 2 },
      { label: '普通用户', value: 3 },
      { label: '访客', value: 4 }
    ],
    tooltip: '角色决定用户的权限范围',
    defaultValue: undefined
  },
  {
    label: '所属部门',
    prop: 'deptId',
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择所属部门',
      clearable: true
    },
    options: [
      { label: '技术部', value: 1 },
      { label: '产品部', value: 2 },
      { label: '运营部', value: 3 },
      { label: '市场部', value: 4 }
    ],
    defaultValue: undefined
  },
  {
    label: '岗位',
    prop: 'postId',
    valueType: 'select',
    fieldProps: {
      placeholder: '请选择岗位',
      clearable: true
    },
    options: [
      { label: '总经理', value: 1 },
      { label: '部门经理', value: 2 },
      { label: '技术总监', value: 3 },
      { label: '产品经理', value: 4 },
      { label: '开发工程师', value: 5 },
      { label: '测试工程师', value: 6 }
    ],
    defaultValue: undefined
  },
  {
    label: '用户状态',
    prop: 'status',
    valueType: 'switch',
    fieldProps: {
      activeValue: 1,
      inactiveValue: 0,
      activeText: '启用',
      inactiveText: '禁用'
    },
    tooltip: '禁用后用户将无法登录系统',
    defaultValue: 1
  },

  // 备注信息
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
    colProps: { span: 24 },
    defaultValue: ''
  }
]

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度为4-20个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '用户名必须以字母开头，只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为2-20个字符', trigger: 'blur' }
  ],
  password: [
    {
      required: !props.isEdit,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 32,
      message: '密码长度为6-32位',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式',
      trigger: 'blur'
    }
  ],
  roleId: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
  deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
}

// 监听表单数据变化
watch(
  () => props.formData,
  (val) => {
    if (val && Object.keys(val).length > 0) {
      form.value = { ...val }
    } else {
      form.value = {
        username: '',
        nickname: '',
        password: '',
        email: '',
        phone: '',
        gender: 1,
        birthday: '',
        avatar: '',
        roleId: undefined,
        deptId: undefined,
        postId: undefined,
        address: '',
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

    // TODO: 调用实际 API
    // if (props.isEdit) {
    //   await updateUser(form.value)
    // } else {
    //   await createUser(form.value)
    // }

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

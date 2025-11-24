<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1 class="title">后台管理系统</h1>
        <p class="subtitle">Admin Management System</p>
      </div>

      <el-form ref="formRef" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" clearable>
            <template #prefix>
              <SvgIcon icon="ri:user-line" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <SvgIcon icon="ri:lock-line" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <p>测试账号：</p>
        <p>管理员：admin / admin</p>
        <p>普通用户：user / user</p>
        <p>编辑人员：editor / editor</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: 'LoginPage'
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: 'admin'
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      console.log('🔐 开始登录...')
      const result = await userStore.login(loginForm.username, loginForm.password)

      if (result.success) {
        console.log('✅ 登录成功，准备跳转...')
        ElMessage.success('登录成功')

        // 跳转到重定向页面或首页
        const redirect = (route.query.redirect as string) || '/'
        console.log('🔄 跳转目标:', redirect)

        await router.push(redirect)
        console.log('✅ 跳转完成')
      } else {
        console.error('❌ 登录失败:', result.message)
        ElMessage.error(result.message || '登录失败')
      }
    } catch (error) {
      console.error('❌ 登录异常:', error)
      ElMessage.error('登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .title {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: #999;
  }
}

.login-form {
  .login-button {
    width: 100%;
  }
}

.login-tips {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>

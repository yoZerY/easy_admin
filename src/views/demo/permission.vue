<template>
  <div class="permission-demo p-6">
    <el-card class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">当前用户信息</span>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">
          {{ userStore.userInfo?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ userStore.userInfo?.nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag v-for="role in userStore.roles" :key="role" class="mr-2">
            {{ role }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="权限">
          <el-tag v-for="perm in userStore.permissions" :key="perm" type="success" class="mr-2">
            {{ perm }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span class="font-semibold">角色权限控制</span>
          </template>

          <div class="space-y-4">
            <div>
              <p class="mb-2 text-gray-600">只有 admin 角色可见：</p>
              <el-button v-role="'admin'" type="primary">管理员按钮</el-button>
              <el-tag v-if="!hasRole('admin')" type="danger" class="ml-2">
                您不是管理员，看不到按钮
              </el-tag>
            </div>

            <div>
              <p class="mb-2 text-gray-600">只有 user 角色可见：</p>
              <el-button v-role="'user'" type="success">普通用户按钮</el-button>
              <el-tag v-if="!hasRole('user')" type="danger" class="ml-2">
                您不是普通用户，看不到按钮
              </el-tag>
            </div>

            <div>
              <p class="mb-2 text-gray-600">admin 或 editor 角色可见：</p>
              <el-button v-role="['admin', 'editor']" type="warning"> 管理员或编辑按钮 </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span class="font-semibold">操作权限控制</span>
          </template>

          <div class="space-y-4">
            <div>
              <p class="mb-2 text-gray-600">需要 system:user:add 权限：</p>
              <el-button v-auth="'system:user:add'" type="primary">新增用户</el-button>
              <el-tag v-if="!hasAuth('system:user:add')" type="danger" class="ml-2">
                没有新增权限
              </el-tag>
            </div>

            <div>
              <p class="mb-2 text-gray-600">需要 system:user:edit 权限：</p>
              <el-button v-auth="'system:user:edit'" type="success">编辑用户</el-button>
              <el-tag v-if="!hasAuth('system:user:edit')" type="danger" class="ml-2">
                没有编辑权限
              </el-tag>
            </div>

            <div>
              <p class="mb-2 text-gray-600">需要 system:user:delete 权限：</p>
              <el-button v-auth="'system:user:delete'" type="danger">删除用户</el-button>
              <el-tag v-if="!hasAuth('system:user:delete')" type="danger" class="ml-2">
                没有删除权限
              </el-tag>
            </div>

            <div>
              <p class="mb-2 text-gray-600">需要多个权限之一：</p>
              <el-button v-auth="['system:user:edit', 'system:user:delete']" type="warning">
                编辑或删除
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-4">
      <template #header>
        <span class="font-semibold">代码中判断权限</span>
      </template>

      <div class="space-y-4">
        <div>
          <p class="mb-2 text-gray-600">使用 computed 判断：</p>
          <el-alert v-if="canAdd" type="success" :closable="false"> 您有新增用户权限 </el-alert>
          <el-alert v-else type="error" :closable="false"> 您没有新增用户权限 </el-alert>
        </div>

        <div>
          <p class="mb-2 text-gray-600">使用 v-if 判断：</p>
          <el-button v-if="isAdmin" type="primary">管理员专属功能</el-button>
          <el-tag v-else type="info">您不是管理员</el-tag>
        </div>

        <div>
          <p class="mb-2 text-gray-600">复杂权限判断：</p>
          <el-button v-if="isAdmin || canEdit" type="success"> 管理员或有编辑权限可用 </el-button>
          <el-tag v-else type="warning">需要管理员或编辑权限</el-tag>
        </div>
      </div>
    </el-card>

    <el-card class="mt-4">
      <template #header>
        <span class="font-semibold">权限测试</span>
      </template>

      <el-form :model="testForm" label-width="120px">
        <el-form-item label="测试权限">
          <el-input v-model="testForm.permission" placeholder="如：system:user:add" />
        </el-form-item>
        <el-form-item label="测试角色">
          <el-input v-model="testForm.role" placeholder="如：admin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="testPermission">测试权限</el-button>
          <el-button type="success" @click="testRole">测试角色</el-button>
        </el-form-item>
      </el-form>

      <el-alert v-if="testResult" :type="testResult.type" :closable="false" class="mt-4">
        {{ testResult.message }}
      </el-alert>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user'
import { hasAuth, hasRole } from '@/utils/auth'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'PermissionDemo'
})

const router = useRouter()
const userStore = useUserStore()

// 权限判断
const canAdd = computed(() => hasAuth('system:user:add'))
const canEdit = computed(() => hasAuth('system:user:edit'))
const isAdmin = computed(() => hasRole('admin'))

// 测试表单
const testForm = reactive({
  permission: 'system:user:add',
  role: 'admin'
})

const testResult = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// 测试权限
const testPermission = () => {
  const result = hasAuth(testForm.permission)
  testResult.value = {
    type: result ? 'success' : 'error',
    message: result
      ? `✅ 您有 "${testForm.permission}" 权限`
      : `❌ 您没有 "${testForm.permission}" 权限`
  }
}

// 测试角色
const testRole = () => {
  const result = hasRole(testForm.role)
  testResult.value = {
    type: result ? 'success' : 'error',
    message: result ? `✅ 您有 "${testForm.role}" 角色` : `❌ 您没有 "${testForm.role}" 角色`
  }
}

// 退出登录
const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    type: 'warning'
  })

  await userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.permission-demo {
  background: var(--el-bg-color);
  min-height: 100%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const router = useRouter()
const { register } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  if (password.value.length < 6) {
    error.value = '密码至少需要6个字符'
    return
  }

  loading.value = true
  
  try {
    await register(email.value, password.value)
    router.push('/login')
  } catch (e: any) {
    error.value = e.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">注册</h1>
        <p class="mt-2 text-gray-600">创建账号开始使用问卷系统</p>
      </div>

      <Card>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <Label required>邮箱</Label>
            <Input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label required>密码</Label>
            <Input
              v-model="password"
              type="password"
              placeholder="至少6个字符"
              required
            />
          </div>

          <div>
            <Label required>确认密码</Label>
            <Input
              v-model="confirmPassword"
              type="password"
              placeholder="再次输入密码"
              required
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {{ error }}
          </div>

          <Button
            type="submit"
            :disabled="loading"
            class="w-full"
          >
            {{ loading ? '注册中...' : '注册' }}
          </Button>

          <div class="text-center text-sm text-gray-600">
            已有账号？
            <router-link to="/login" class="text-blue-600 hover:text-blue-700">登录</router-link>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    await login(email.value, password.value)
    router.push('/my-surveys')
  } catch (e: any) {
    error.value = e.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">登录</h1>
        <p class="mt-2 text-gray-600">登录以管理您的问卷</p>
      </div>

      <Card>
        <form @submit.prevent="handleLogin" class="space-y-4">
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
              placeholder="••••••••"
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
            {{ loading ? '登录中...' : '登录' }}
          </Button>

          <div class="text-center text-sm text-gray-600">
            还没有账号？
            <router-link to="/register" class="text-blue-600 hover:text-blue-700">注册</router-link>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

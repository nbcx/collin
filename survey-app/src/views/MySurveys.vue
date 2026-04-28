<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/composables/useAuth'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const { getUser, logout } = useAuth()

const surveys = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const user = getUser()
  if (!user) {
    router.push('/login')
    return
  }
  await loadSurveys()
})

const loadSurveys = async () => {
  const user = getUser()
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  if (!error && data) {
    surveys.value = data
  }
  loading.value = false
}

const viewResults = (surveyId: string) => {
  router.push(`/survey/${surveyId}/results`)
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">我的问卷</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-700 hover:text-gray-900">首页</router-link>
            <button @click="handleLogout" class="text-red-600 hover:text-red-700">退出登录</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">我创建的问卷</h2>
          <router-link to="/create">
            <Button>创建新问卷</Button>
          </router-link>
        </div>

        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-500">加载中...</p>
        </div>

        <div v-else-if="surveys.length === 0" class="text-center py-12">
          <p class="text-gray-500 mb-4">您还没有创建任何问卷</p>
          <router-link to="/create">
            <Button>创建第一个问卷</Button>
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="survey in surveys" :key="survey.id" class="hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ survey.title }}</h3>
            <p v-if="survey.description" class="text-gray-600 text-sm mb-4">{{ survey.description }}</p>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{{ survey.is_public ? '公开' : '私密' }}</span>
              <span>{{ new Date(survey.created_at).toLocaleDateString('zh-CN') }}</span>
            </div>
            <div class="flex space-x-2">
              <Button @click="viewResults(survey.id)" size="sm" variant="outline">查看结果</Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

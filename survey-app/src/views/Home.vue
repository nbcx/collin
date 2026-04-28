<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const surveys = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  
  if (!error && data) {
    surveys.value = data
  }
  loading.value = false
})

const takeSurvey = (id: string) => {
  router.push(`/survey/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">问卷调查系统</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-700 hover:text-gray-900">首页</router-link>
            <router-link to="/my-surveys" class="text-gray-700 hover:text-gray-900">我的问卷</router-link>
            <router-link to="/create" class="text-gray-700 hover:text-gray-900">创建问卷</router-link>
            <router-link to="/login" class="text-blue-600 hover:text-blue-700">登录</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">公开问卷</h2>
          <p class="text-gray-600">选择一个问卷开始填写</p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-500">加载中...</p>
        </div>

        <div v-else-if="surveys.length === 0" class="text-center py-12">
          <p class="text-gray-500">暂无公开问卷</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="survey in surveys" :key="survey.id" class="hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ survey.title }}</h3>
            <p v-if="survey.description" class="text-gray-600 text-sm mb-4">{{ survey.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">
                {{ new Date(survey.created_at).toLocaleDateString('zh-CN') }}
              </span>
              <Button @click="takeSurvey(survey.id)" size="sm">填写问卷</Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Card from '@/components/ui/Card.vue'

const route = useRoute()
const router = useRouter()

const survey = ref<any>(null)
const questions = ref<any[]>([])
const responses = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  const [surveyRes, questionsRes, responsesRes] = await Promise.all([
    supabase.from('surveys').select('*').eq('id', route.params.id).single(),
    supabase.from('questions').select('*').eq('survey_id', route.params.id).order('order'),
    supabase.from('responses').select('*').eq('survey_id', route.params.id)
  ])

  if (surveyRes.data) survey.value = surveyRes.data
  if (questionsRes.data) questions.value = questionsRes.data
  if (responsesRes.data) responses.value = responsesRes.data

  loading.value = false
}

const getStatistics = (question: any) => {
  const answers = responses.value
    .map(r => r.answers[question.id])
    .filter(a => a !== undefined && a !== null && a !== '')

  if (question.type === 'single' || question.type === 'dropdown') {
    const counts: Record<string, number> = {}
    answers.forEach(a => {
      counts[a] = (counts[a] || 0) + 1
    })
    return { type: 'count', counts, total: answers.length }
  }

  if (question.type === 'multiple') {
    const counts: Record<string, number> = {}
    answers.forEach((a: string[]) => {
      if (Array.isArray(a)) {
        a.forEach(item => {
          counts[item] = (counts[item] || 0) + 1
        })
      }
    })
    return { type: 'count', counts, total: answers.length }
  }

  if (question.type === 'rating') {
    const values = answers.map(Number)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return { type: 'rating', average: avg.toFixed(2), count: values.length }
  }

  return { type: 'text', answers, count: answers.length }
}

const goBack = () => {
  router.push('/my-surveys')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button @click="goBack" class="text-gray-600 hover:text-gray-900 mr-4">← 返回</button>
            <h1 class="text-xl font-bold text-gray-900">问卷结果</h1>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-500">加载中...</p>
        </div>

        <div v-else class="space-y-6">
          <Card>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ survey?.title }}</h1>
            <p v-if="survey?.description" class="text-gray-600 mb-4">{{ survey.description }}</p>
            <div class="text-sm text-gray-500">
              共收到 {{ responses.length }} 份回复
            </div>
          </Card>

          <div v-for="question in questions" :key="question.id" class="space-y-4">
            <Card>
              <h3 class="text-lg font-semibold mb-4">{{ question.title }}</h3>

              <div v-if="getStatistics(question).type === 'count'">
                <div
                  v-for="(count, option) in getStatistics(question).counts"
                  :key="option"
                  class="mb-3"
                >
                  <div class="flex justify-between text-sm mb-1">
                    <span>{{ option }}</span>
                    <span>{{ count }} 票 ({{ ((count / getStatistics(question).total) * 100).toFixed(1) }}%)</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: ((count / getStatistics(question).total) * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <div v-else-if="getStatistics(question).type === 'rating'" class="text-center">
                <div class="text-4xl font-bold text-blue-600 mb-2">
                  {{ getStatistics(question).average }}
                </div>
                <div class="text-gray-600">平均评分 / 5分</div>
                <div class="text-sm text-gray-500 mt-2">
                  基于 {{ getStatistics(question).count }} 份回复
                </div>
              </div>

              <div v-else class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="(answer, index) in getStatistics(question).answers"
                  :key="index"
                  class="p-3 bg-gray-50 rounded text-sm"
                >
                  {{ answer }}
                </div>
              </div>
            </Card>
          </div>

          <div v-if="responses.length === 0" class="text-center py-12">
            <p class="text-gray-500">暂无回复数据</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const route = useRoute()
const router = useRouter()

const survey = ref<any>(null)
const questions = ref<any[]>([])
const answers = ref<Record<string, any>>({})
const password = ref('')
const needPassword = ref(false)
const loading = ref(false)
const submitting = ref(false)

onMounted(async () => {
  await loadSurvey()
})

const loadSurvey = async () => {
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error || !data) {
    alert('问卷不存在')
    router.push('/')
    return
  }

  survey.value = data

  if (!data.is_public) {
    needPassword.value = true
    return
  }

  await loadQuestions()
}

const loadQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('survey_id', route.params.id)
    .order('order', { ascending: true })

  if (!error && data) {
    questions.value = data
  }
}

const verifyPassword = () => {
  if (password.value === survey.value.password) {
    needPassword.value = false
    loadQuestions()
  } else {
    alert('密码错误')
  }
}

const submitSurvey = async () => {
  for (const question of questions.value) {
    if (question.required && !answers.value[question.id]) {
      alert('请完成所有必填问题')
      return
    }
  }

  submitting.value = true

  try {
    const { error } = await supabase
      .from('responses')
      .insert({
        survey_id: route.params.id as string,
        answers: answers.value
      })

    if (error) throw error

    alert('提交成功！感谢您的参与')
    router.push('/')
  } catch (error: any) {
    alert('提交失败：' + error.message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">填写问卷</h1>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div v-if="needPassword" class="max-w-md mx-auto mt-12">
          <Card>
            <h2 class="text-xl font-semibold mb-4">此问卷需要密码</h2>
            <div class="space-y-4">
              <div>
                <Label>请输入密码</Label>
                <Input v-model="password" type="password" />
              </div>
              <Button @click="verifyPassword" class="w-full">验证</Button>
            </div>
          </Card>
        </div>

        <div v-else-if="loading" class="text-center py-12">
          <p class="text-gray-500">加载中...</p>
        </div>

        <div v-else class="space-y-6">
          <Card>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ survey?.title }}</h1>
            <p v-if="survey?.description" class="text-gray-600">{{ survey.description }}</p>
          </Card>

          <Card>
            <div class="space-y-6">
              <div v-for="question in questions" :key="question.id" class="space-y-2">
                <Label :required="question.required">{{ question.title }}</Label>

                <!-- 单选题 -->
                <div v-if="question.type === 'single'" class="space-y-2">
                  <label
                    v-for="option in question.options"
                    :key="option"
                    class="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      :name="question.id"
                      :value="option"
                      v-model="answers[question.id]"
                      class="text-blue-600"
                    />
                    <span>{{ option }}</span>
                  </label>
                </div>

                <!-- 多选题 -->
                <div v-else-if="question.type === 'multiple'" class="space-y-2">
                  <label
                    v-for="option in question.options"
                    :key="option"
                    class="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="option"
                      v-model="answers[question.id]"
                      class="text-blue-600"
                    />
                    <span>{{ option }}</span>
                  </label>
                </div>

                <!-- 填空题 -->
                <div v-else-if="question.type === 'text'">
                  <textarea
                    v-model="answers[question.id]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    :placeholder="question.required ? '请输入' : '选填'"
                  ></textarea>
                </div>

                <!-- 下拉题 -->
                <div v-else-if="question.type === 'dropdown'">
                  <select
                    v-model="answers[question.id]"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">请选择</option>
                    <option v-for="option in question.options" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>

                <!-- 评分题 -->
                <div v-else-if="question.type === 'rating'" class="flex items-center space-x-2">
                  <span>1</span>
                  <input
                    type="range"
                    v-model="answers[question.id]"
                    min="1"
                    max="5"
                    class="flex-1"
                  />
                  <span>5</span>
                  <span class="ml-2 font-semibold">{{ answers[question.id] || 3 }}</span>
                </div>
              </div>
            </div>
          </Card>

          <div class="flex justify-end">
            <Button @click="submitSurvey" :disabled="submitting" size="lg">
              {{ submitting ? '提交中...' : '提交问卷' }}
            </Button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

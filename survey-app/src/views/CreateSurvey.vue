<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/composables/useAuth'
import type { Question } from '@/types'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const router = useRouter()
const { getUser } = useAuth()

const survey = ref({
  title: '',
  description: '',
  is_public: true,
  password: ''
})

const questions = ref<Question[]>([])
const loading = ref(false)

const addQuestion = () => {
  questions.value.push({
    type: 'single',
    title: '',
    options: [],
    required: true,
    order: questions.value.length
  })
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
  questions.value.forEach((q, i) => q.order = i)
}

const addOption = (question: Question) => {
  if (!question.options) question.options = []
  question.options.push('')
}

const removeOption = (question: Question, index: number) => {
  question.options?.splice(index, 1)
}

const handleCreate = async () => {
  if (!survey.value.title) {
    alert('请输入问卷标题')
    return
  }

  if (questions.value.length === 0) {
    alert('请至少添加一个问题')
    return
  }

  loading.value = true
  const user = getUser()

  try {
    const surveyId = uuidv4()
    
    const { error: surveyError } = await supabase
      .from('surveys')
      .insert({
        id: surveyId,
        title: survey.value.title,
        description: survey.value.description,
        creator_id: user.id,
        is_public: survey.value.is_public,
        password: survey.value.password || null
      })

    if (surveyError) throw surveyError

    for (const question of questions.value) {
      const { error: questionError } = await supabase
        .from('questions')
        .insert({
          survey_id: surveyId,
          type: question.type,
          title: question.title,
          options: question.options?.filter(o => o.trim()) || null,
          required: question.required,
          order: question.order
        })

      if (questionError) throw questionError
    }

    alert('问卷创建成功！')
    router.push('/my-surveys')
  } catch (error: any) {
    alert('创建失败：' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">创建问卷</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/my-surveys" class="text-gray-700 hover:text-gray-900">返回</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0 space-y-6">
        <Card>
          <div class="space-y-4">
            <div>
              <Label required>问卷标题</Label>
              <Input v-model="survey.title" placeholder="输入问卷标题" />
            </div>
            
            <div>
              <Label>问卷描述</Label>
              <textarea
                v-model="survey.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="输入问卷描述（可选）"
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="survey.is_public"
                  class="mr-2"
                />
                公开问卷
              </label>

              <div v-if="!survey.is_public" class="flex-1">
                <Input v-model="survey.password" placeholder="设置访问密码" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">问题列表</h2>
            <Button @click="addQuestion" variant="outline">添加问题</Button>
          </div>

          <div v-if="questions.length === 0" class="text-center py-8 text-gray-500">
            暂无问题，点击上方按钮添加
          </div>

          <div v-else class="space-y-6">
            <div v-for="(question, qIndex) in questions" :key="qIndex" class="border rounded-lg p-4 space-y-4">
              <div class="flex justify-between items-start">
                <h3 class="font-medium">问题 {{ qIndex + 1 }}</h3>
                <button @click="removeQuestion(qIndex)" class="text-red-600 hover:text-red-700">删除</button>
              </div>

              <div>
                <Label required>问题标题</Label>
                <Input v-model="question.title" placeholder="输入问题" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label>题型</Label>
                  <select
                    v-model="question.type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="single">单选题</option>
                    <option value="multiple">多选题</option>
                    <option value="text">填空题</option>
                    <option value="dropdown">下拉题</option>
                    <option value="rating">评分题</option>
                  </select>
                </div>

                <div>
                  <label class="flex items-center mt-6">
                    <input type="checkbox" v-model="question.required" class="mr-2" />
                    必填
                  </label>
                </div>
              </div>

              <div v-if="['single', 'multiple', 'dropdown'].includes(question.type)">
                <Label>选项</Label>
                <div class="space-y-2">
                  <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center space-x-2">
                    <Input
                      v-model="question.options![oIndex]"
                      placeholder="输入选项"
                      class="flex-1"
                    />
                    <button @click="removeOption(question, oIndex)" class="text-red-600">删除</button>
                  </div>
                  <Button @click="addOption(question)" size="sm" variant="outline">添加选项</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div class="flex justify-end space-x-4">
          <router-link to="/my-surveys">
            <Button variant="outline">取消</Button>
          </router-link>
          <Button @click="handleCreate" :disabled="loading">
            {{ loading ? '创建中...' : '创建问卷' }}
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>

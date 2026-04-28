<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  required?: boolean
}>()

const classes = computed(() => {
  return cn(
    'block text-sm font-medium text-gray-700 mb-1'
  )
})
</script>

<template>
  <label :class="classes">
    <slot />
    <span v-if="required" class="text-red-500 ml-1">*</span>
  </label>
</template>

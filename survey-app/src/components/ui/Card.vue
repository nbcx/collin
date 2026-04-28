<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>()

const classes = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return cn(
    'bg-white rounded-lg shadow-md border border-gray-200',
    paddings[props.padding || 'md']
  )
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

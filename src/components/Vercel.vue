<template>
  <div>
    <h1>Vue + Vercel Demo</h1>

    <n-button @click="fetchData">调用 API</n-button>

    <pre>{{ data }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref('')

async function fetchData() {
  const res = await fetch('/api/hello')
  const json = await res.json()
  data.value = JSON.stringify(json, null, 2)
}
</script>

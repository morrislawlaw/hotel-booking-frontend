<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  try {
    // The backend already handled Google and returned token in the response
    // But since it's a redirect, we can fetch the current user or just redirect to home
    // For simplicity, we'll just go to home and let the user refresh
    console.log('✅ Google callback received')
    router.push('/')
  } catch (err) {
    console.error(err)
    router.push('/')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-xl">Signing you in with Google...</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// Handle Google callback token
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  if (token) {
    console.log('✅ Google Login Success - Authentication Token received')

    // 2. Save token locally so the user stays logged in if they refresh
    localStorage.setItem('authToken', token)
    
    // 3. Update your global Pinia state management store
    userStore.setToken(token)

    // 4. CLEAN THE URL: Instantly remove '?token=xxxx' from the browser address bar
    // This leaves a clean, beautiful "https://488865.xyz/" for the user
    window.history.replaceState({}, document.title, window.location.pathname)

    // 5. Safely drop the user at the home dashboard route
    router.push('/')
  }
})

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>
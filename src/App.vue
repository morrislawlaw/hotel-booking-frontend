<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { jwtDecode } from 'jwt-decode' // Ensure you have run: npm install jwt-decode

const router = useRouter()
const userStore = useUserStore()

// Handle Google callback token and parse session claims
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  if (token) {
    console.log('✅ Google Login Success - Authentication Token received')

    try {
      // 1. Decode the JWT securely to pull out the user identification email claim
      const decoded: any = jwtDecode(token)
      
      // Standard ASP.NET Identity maps the name claim to this long XML schema URL string, checking standard fallback names as well
      const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name || 'Google User'

      // 2. Update your global Pinia store with BOTH parameters (This automatically handles saving to localStorage inside the store)
      userStore.setToken(token, email)
      
      console.log(`👤 Synchronized session state for user: ${email}`)
    } catch (err) {
      console.error('Failed to parse or synchronize incoming token claims:', err)
    }

    // 3. CLEAN THE URL: Instantly remove '?token=xxxx' from the browser address bar
    window.history.replaceState({}, document.title, window.location.pathname)

    // 4. Safely drop the user at the home dashboard route
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
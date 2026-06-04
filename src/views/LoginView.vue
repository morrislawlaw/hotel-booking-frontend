<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleNormalLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('/auth/Loginv2', {
      user_id: email.value,
      password: password.value
    })

//     if (response.data && response.data.success) {
//       const token = response.data.data.token
//       userStore.setToken(token, email.value)
//       router.push('/')
//     } else {
//       errorMessage.value = response.data.message || 'Login failed.'
//     }
//   } catch (err: any) {
//     console.error('Login request failed:', err)
//     errorMessage.value = 'Network error. Please try again later.'
//   } finally {
//     isLoading.value = false

    // 🔥 FIX: Read the structured ApiResponse data model returned by your backend
    if (response.data && response.data.statusCode === 200) {
      const token = response.data.data.token
      
      // Save token and sync UI variables
      userStore.setToken(token, email.value)
      
      // Clear alerts and push immediately to Home view
      router.push('/')
    } else {
      errorMessage.value = response.data.message || 'Invalid email or password configuration.'
    }
  } catch (err: any) {
    console.error('Login request failed:', err)
    errorMessage.value = 'Network connection failed. Please try again later.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Sign in to HotelBook</h2>
        <p class="mt-2 text-sm text-gray-600">Discover your perfect stay</p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleNormalLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input v-model="email" id="email-address" type="email" required autocomplete="email"
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" id="password" type="password" required autocomplete="current-password"
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
      </form>

      <div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or continue with</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>

      <div>
        <a href="https://hotelapi-f5bdebbke6eceyfg.southeastasia-01.azurewebsites.net/api/auth/google"
           class="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.28c1.92,-1.78 3.03,-4.39 3.03,-7.4C21.65,11.8 21.56,11.4 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.75c2.43,0 4.47,-0.8 5.96,-2.2l-3.28,-2.6c-0.9,0.6 -2.07,0.98 -3.28,0.98 -2.34,0 -4.33,-1.58 -5.03,-3.71H3.01v2.7C4.5,18.9 8,20.75 12,20.75z" fill="#34A853" />
              <path d="M6.97,13.22a5.4,5.4 0 0 1 0,-3.44V7.08H3.01a9,9 0 0 0 0,7.84l3.96,-2.7z" fill="#FBBC05" />
              <path d="M12,6.07c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.32 14.43,2.5 12,2.5c-4,0 -7.5,1.85 -8.99,4.58l3.96,2.72c0.7,-2.13 2.69,-3.73 5.03,-3.73z" fill="#EA4335" />
            </g>
          </svg>
          Sign in with Google
        </a>
      </div>

      <div class="text-center text-sm text-gray-600 mt-4">
        Don't have an account? 
        <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500 ml-1">Register here</router-link>
      </div>
    </div>
  </div>
</template>
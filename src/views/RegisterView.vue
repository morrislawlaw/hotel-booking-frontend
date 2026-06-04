<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill out all required fields.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      phone: phone.value ? phone.value : null,
      password: password.value
    })

    if (response.data && response.data.statusCode === 200) {
      successMessage.value = 'Registration successful! logging you in...'
      
      // 🚀 AUTOMATIC LOGIN LOOP: Authenticate immediately right after account provisioning finishes
      const loginResponse = await api.post('/auth/Loginv2', {
        user_id: email.value,
        password: password.value
      })

      if (loginResponse.data && loginResponse.data.statusCode === 200) {
        const token = loginResponse.data.data.token
        // Set Pinia storage metrics
        const useStore = useUserStore()
        useStore.setToken(token, email.value)
        
        // Push straight back to dashboard view state
        router.push('/')
      } else {
        // Fallback redirection to login if automated sign-in fails
        router.push('/login')
      }
    } else {
      errorMessage.value = response.data.message || 'Registration failed.'
    }
  } catch (err) {
    console.error('Registration error:', err)
    errorMessage.value = 'An error occurred during account registration processing metrics.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Create your Account</h2>
        <p class="mt-2 text-sm text-gray-600">Join HotelBook to manage your bookings</p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
        {{ successMessage }}
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-sm font-medium text-gray-700">Full Name *</label>
          <input v-model="name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email Address *</label>
          <input v-model="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
          <input v-model="phone" type="tel" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password *</label>
          <input v-model="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div class="pt-2">
          <button type="submit" :disabled="isLoading"
                  class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </div>
      </form>

      <div class="text-center text-sm text-gray-600 mt-4">
        Already have an account? 
        <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 ml-1">Sign in here</router-link>
      </div>
    </div>
  </div>
</template>
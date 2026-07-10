<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const loginWithGoogle = () => {
  // Redirect directly to your live production Google OAuth endpoint
  window.location.href = 'https://hotel-api-linux-bdf7g6f3bjf0dwhz.eastasia-01.azurewebsites.net/api/auth/google';
}

const logout = () => {
  // Clean up user states globally using the Pinia store action
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-white border-b shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      
      <div class="flex items-center gap-3">
        <span class="text-4xl">🏨</span>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">HotelBook</h1>
          <p class="text-xs text-gray-500 -mt-1">Hong Kong • Taipei • Singapore</p>
        </div>
      </div>

      <div class="flex items-center gap-8 text-sm font-medium">
        <RouterLink to="/" class="hover:text-blue-600 transition-colors">Home</RouterLink>
        <RouterLink to="/hotels" class="hover:text-blue-600 transition-colors">Browse Hotels</RouterLink>
        <RouterLink to="/my-bookings" class="hover:text-blue-600 transition-colors">My Bookings</RouterLink>
      </div>

      <div class="flex items-center gap-4">
        
        <div v-if="!userStore.isAuthenticated" class="flex items-center gap-3">
          <RouterLink 
            to="/login" 
            class="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-2xl text-sm font-medium transition text-center text-gray-900">
            Sign In
          </RouterLink>

          <button 
            @click="loginWithGoogle"
            class="flex items-center gap-3 bg-white border border-gray-300 hover:border-gray-400 px-5 py-2.5 rounded-2xl text-sm font-medium transition-colors">
            <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5">
            Sign in with Google
          </button>
        </div>

        <div v-else class="flex items-center gap-6">
          <div class="text-right text-sm">
            <div class="text-gray-500 text-xs">Logged in as</div>
            <div class="font-medium text-gray-900">{{ userStore.userEmail }}</div>
          </div>

          <button 
            @click="logout"
            class="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
            Logout
          </button>
        </div>

      </div>
    </div>
  </nav>
</template>
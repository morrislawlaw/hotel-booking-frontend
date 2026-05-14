<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const switchUser = (customerId: number, name: string, email: string) => {
  userStore.switchUser(customerId, name, email)
  router.push('/')   // ← Redirect to Home so data refreshes
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

      <!-- User Info + Switcher -->
      <div class="flex items-center gap-4">
        <div class="text-right text-sm">
          <div class="text-gray-500 text-xs">Logged in as</div>
          <div class="font-medium">{{ userStore.currentUser.name }}</div>
        </div>

        <div class="relative group">
          <button class="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-2xl text-sm font-medium transition">
            Switch User
          </button>
          <div class="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border">
            <button 
              @click="switchUser(1, 'John Smith', 'john.smith@email.com')"
              class="w-full text-left px-6 py-3 hover:bg-gray-100 flex justify-between items-center">
              <span>John Smith</span>
              <span class="text-xs text-gray-400">ID 1</span>
            </button>
            <button 
              @click="switchUser(2, 'Maria Garcia', 'maria.garcia@email.com')"
              class="w-full text-left px-6 py-3 hover:bg-gray-100 flex justify-between items-center">
              <span>Maria Garcia</span>
              <span class="text-xs text-gray-400">ID 2</span>
            </button>
            <button 
              @click="switchUser(6, 'Emma Li', 'emma.li@email.com')"
              class="w-full text-left px-6 py-3 hover:bg-gray-100 flex justify-between items-center">
              <span>Emma Li</span>
              <span class="text-xs text-gray-400">ID 6</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
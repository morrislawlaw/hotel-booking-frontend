<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const checkIn = ref('')
const checkOut = ref('')
const guests = ref(2)
const errorMessage = ref('') // Added reactive error state

const searchHotels = () => {
  // Clear previous errors
  errorMessage.value = ''

  // 1. Validation: Check empty inputs
  if (!checkIn.value || !checkOut.value) {
    errorMessage.value = 'Please select check-in and check-out dates'
    return
  }

  // 2. Validation: Check-out must be after check-in
  if (new Date(checkOut.value) <= new Date(checkIn.value)) {
    errorMessage.value = 'Check-out date must be after check-in date'
    return
  }

  // if (!checkIn.value || !checkOut.value) {
  //   alert('Please select check-in and check-out dates')
  //   return
  // }

  router.push({
    name: 'hotels',
    query: {
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      guests: guests.value
    }
  })
}
</script>

<template>
  <div class="relative h-[90vh] flex items-center justify-center overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-[url('https://picsum.photos/id/1015/2000/1200')] bg-cover bg-center">
      <div class="absolute inset-0 bg-black/50"></div>
    </div>

    <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
      <h1 class="text-6xl font-bold text-white mb-4 tracking-tight">
        Find Your Perfect Stay
      </h1>
      <p class="text-xl text-white/90 mb-10">
        Book hotels in Hong Kong, Taipei & Singapore with real-time availability
      </p>

      <!-- Search Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
      <!-- Validation Error Message Banner -->
        <div 
          v-if="errorMessage" 
          role="alert"
          class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm font-medium rounded-2xl text-left"
        >
          ⚠️ {{ errorMessage }}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input 
              v-model="checkIn"
              type="date" 
              class="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input 
              v-model="checkOut"
              type="date" 
              class="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Guests</label>
            <select 
              v-model="guests"
              class="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 Guest</option>
              <option value="2" selected>2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="searchHotels"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-95">
              Search Hotels
            </button>
          </div>
        </div>
      </div>

      <p class="text-white/70 mt-8 text-sm">
        Trusted by thousands • Real-time availability from your .NET backend
      </p>
    </div>
  </div>
</template>
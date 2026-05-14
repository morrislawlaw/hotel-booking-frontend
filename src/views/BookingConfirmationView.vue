<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const bookingId = route.query.bookingId as string
const totalAmount = route.query.total as string
const checkIn = route.query.checkIn as string
const checkOut = route.query.checkOut as string
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
      <!-- Success Icon -->
      <div class="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <span class="text-5xl">🎉</span>
      </div>

      <h1 class="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
      <p class="text-gray-600 mb-8">Thank you for choosing HotelBook</p>

      <div class="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-500">Booking ID</span>
            <span class="font-mono font-bold text-lg">#{{ bookingId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Check-in</span>
            <span>{{ checkIn }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Check-out</span>
            <span>{{ checkOut }}</span>
          </div>
          <div v-if="totalAmount" class="flex justify-between border-t pt-3 font-semibold">
            <span>Total Paid</span>
            <span>HKD {{ Number(totalAmount).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <button 
          @click="router.push('/')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg">
          Book Another Stay
        </button>
        
        <button 
          @click="router.push('/my-bookings')"
          class="w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium">
          View My Bookings
        </button>
      </div>
    </div>
  </div>
</template>
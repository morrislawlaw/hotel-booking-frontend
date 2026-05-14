<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const bookingId = Number(route.params.id)

const booking = ref<any>(null)
const loading = ref(true)
const actionLoading = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const loadBookingDetail = async () => {
  loading.value = true
  try {
    const res = await api.post('/HotelBookingSystem/GetBookingDetail', { bookingID: bookingId })
    booking.value = res.data?.data || res.data
  } catch (err: any) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Cancel
const cancelBooking = async () => {
  if (!confirm('Cancel this booking?')) return
  actionLoading.value = true
  try {
    const res = await api.post('/HotelBookingSystem/CancelBooking', { bookingID: bookingId })
    message.value = { type: 'success', text: '✅ Booking cancelled successfully' }
    loadBookingDetail()
  } catch (err: any) {
    message.value = { type: 'error', text: err.response?.data?.message || 'Cancel failed' }
  } finally {
    actionLoading.value = false
  }
}

// Check-in
const checkInBooking = async () => {
  if (!confirm('Check-in this booking?')) return
  actionLoading.value = true
  try {
    const res = await api.post('/HotelBookingSystem/CheckInBooking', { bookingID: bookingId })
    message.value = { type: 'success', text: '✅ Checked in successfully' }
    loadBookingDetail()
  } catch (err: any) {
    message.value = { type: 'error', text: err.response?.data?.message || 'Check-in failed' }
  } finally {
    actionLoading.value = false
  }
}

// Check-out
const checkOutBooking = async () => {
  if (!confirm('Check-out this booking?')) return
  actionLoading.value = true
  try {
    const res = await api.post('/HotelBookingSystem/CheckOutBooking', { bookingID: bookingId })
    message.value = { type: 'success', text: '✅ Checked out successfully' }
    loadBookingDetail()
  } catch (err: any) {
    message.value = { type: 'error', text: err.response?.data?.message || 'Check-out failed' }
  } finally {
    actionLoading.value = false
  }
}

onMounted(loadBookingDetail)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <button @click="router.back()" class="mb-6 flex items-center gap-2 text-blue-600 hover:underline">
      ← Back to My Bookings
    </button>

    <div v-if="loading" class="text-center py-20">Loading booking details...</div>

    <div v-else-if="booking" class="bg-white rounded-3xl shadow-2xl p-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-4xl font-bold">Booking #{{ booking.bookingID }}</h1>
          <p class="text-xl text-gray-600">{{ booking.hotelName }} • {{ booking.city }}</p>
        </div>
        <span :class="{
          'bg-green-100 text-green-700': ['Confirmed','CheckedIn'].includes(booking.status),
          'bg-red-100 text-red-700': booking.status === 'Cancelled',
          'bg-blue-100 text-blue-700': booking.status === 'CheckedOut'
        }" class="px-6 py-2 rounded-full font-medium">
          {{ booking.status }}
        </span>
      </div>

      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 class="font-semibold mb-4">Guest</h3>
          <p class="text-2xl">{{ booking.customerName }}</p>
          <p class="text-gray-600">{{ booking.email }}</p>
          <p class="text-gray-600">{{ booking.phone }}</p>
        </div>
        <div>
          <h3 class="font-semibold mb-4">Stay</h3>
          <p><strong>Check-in:</strong> {{ booking.checkInDate }}</p>
          <p><strong>Check-out:</strong> {{ booking.checkOutDate }}</p>
          <p><strong>Nights:</strong> {{ booking.numberOfNights }}</p>
        </div>
      </div>

      <div class="mt-10 p-6 bg-gray-50 rounded-2xl">
        <h3 class="font-semibold mb-3">Rooms Booked</h3>
        <p class="text-lg">{{ booking.roomsBooked }}</p>
      </div>

      <div class="mt-10 text-right">
        <p class="text-4xl font-bold text-emerald-600">HKD {{ booking.totalAmount }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex flex-wrap gap-4">
        <button v-if="booking.status === 'Confirmed'" 
                @click="checkInBooking"
                :disabled="actionLoading"
                class="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700">
          Check In
        </button>

        <button v-if="booking.status === 'CheckedIn'" 
                @click="checkOutBooking"
                :disabled="actionLoading"
                class="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700">
          Check Out
        </button>

        <button v-if="['Pending','Confirmed'].includes(booking.status)" 
                @click="cancelBooking"
                :disabled="actionLoading"
                class="flex-1 py-4 border-2 border-red-400 text-red-600 rounded-2xl font-medium hover:bg-red-50">
          Cancel Booking
        </button>
      </div>

      <!-- Message -->
      <div v-if="message" 
           :class="message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
           class="mt-6 p-4 rounded-2xl text-center">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>
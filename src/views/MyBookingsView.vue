<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useUserStore } from '@/stores/user'   // ← Add this import

const router = useRouter()
const userStore = useUserStore()   // ← Initialize the store

const bookings = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const loadMyBookings = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/HotelBookingSystem/GetBookingReport', {
      status: null,
      fromDate: null,
      toDate: null
    })

    const allBookings = response.data?.data || []

    // Filter only current logged-in user
    bookings.value = allBookings.filter((b: any) => b.customerID === userStore.currentUser.customerId)

    if (bookings.value.length === 0) {
      error.value = 'You have no bookings yet.'
    }
  } catch (err: any) {
    console.error(err)
    error.value = 'Failed to load your bookings'
  } finally {
    loading.value = false
  }
}

const viewDetails = (bookingId: number) => {
  router.push(`/booking-detail/${bookingId}`)
}

onMounted(loadMyBookings)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold">My Bookings</h1>
      <button 
        @click="loadMyBookings"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium">
        🔄 Refresh
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-xl">Loading your bookings...</div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
      {{ error }}
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-20">
      <p class="text-2xl text-gray-400 mb-4">No bookings found</p>
      <button 
        @click="$router.push('/hotels')"
        class="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700">
        Browse Hotels
      </button>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="b in bookings" 
        :key="b.bookingID"
        @click="viewDetails(b.bookingID)"
        class="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition-all cursor-pointer">
        
        <div class="flex flex-col md:flex-row justify-between gap-6">
          <div class="flex-1">
            <h3 class="font-semibold text-xl">#{{ b.bookingID }} - {{ b.hotelName }}</h3>
            <p class="text-gray-600">{{ b.checkIn_Friendly }} → {{ b.checkOut_Friendly }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ b.roomsBooked }}</p>
          </div>

          <div class="text-right">
            <div class="text-3xl font-bold text-emerald-600">HKD {{ b.totalAmount }}</div>
            <div class="text-sm text-gray-500">{{ b.numberOfNights }} nights</div>
            <span :class="{
              'bg-green-100 text-green-700': ['Confirmed','CheckedIn'].includes(b.status),
              'bg-red-100 text-red-700': b.status === 'Cancelled'
            }" class="inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium">
              {{ b.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const bookings = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const loadMyBookings = async () => {
  loading.value = true
  error.value = ''

  try {
    // Send standard query framework request
    const response = await api.post('/HotelBookingSystem/GetBookingReport', {
      status: null,
      fromDate: null,
      toDate: null
    })

    const allBookings = response.data?.data || response.data || []

    // Filter using your updated, token-derived email context identifier
    bookings.value = allBookings.filter((b: any) => b.email === userStore.userEmail)

    if (bookings.value.length === 0) {
      error.value = 'You have no bookings yet.'
    }
  } catch (err: any) {
    console.error('Failed to load reporting context arrays:', err)
    error.value = 'Failed to load your bookings records.'
  } finally {
    loading.value = false
  }
}

const viewDetails = (bookingId: number) => {
  router.push(`/booking-detail/${bookingId}`)
}

onMounted(loadMyBookings)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold">My Bookings</h1>
      <button 
        @click="loadMyBookings"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium">
        🔄 Refresh
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-xl">Loading your bookings...</div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
      {{ error }}
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-20">
      <p class="text-2xl text-gray-400 mb-4">No bookings found</p>
      <button 
        @click="router.push('/hotels')"
        class="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700">
        Browse Hotels
      </button>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="b in bookings" 
        :key="b.bookingID"
        @click="viewDetails(b.bookingID)"
        class="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition-all cursor-pointer">
        
        <div class="flex flex-col md:flex-row justify-between gap-6">
          <div class="flex-1">
            <h3 class="font-semibold text-xl">#{{ b.bookingID }} - {{ b.hotelName }}</h3>
            <p class="text-gray-600">{{ b.checkIn_Friendly || b.checkInFriendly }} → {{ b.checkOut_Friendly || b.checkOutFriendly }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ b.roomsBooked }}</p>
          </div>

          <div class="text-right">
            <div class="text-3xl font-bold text-emerald-600">HKD {{ b.totalAmount }}</div>
            <div class="text-sm text-gray-500">{{ b.numberOfNights }} nights</div>
            <span :class="{
              'bg-green-100 text-green-700': ['Confirmed','CheckedIn'].includes(b.status),
              'bg-red-100 text-red-700': b.status === 'Cancelled'
            }" class="inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium">
              {{ b.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
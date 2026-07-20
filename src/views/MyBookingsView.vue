<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bookingService } from '@/services/bookingService'
import type { BookingReportItemDto } from '@/types/booking'
// import api from '@/services/api'

const router = useRouter()

const bookings = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const loadMyBookings = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // // Hits your backend GetBookingReport endpoint
    // // Sending an empty object matches your backend's BookingReportFilterDto default expectation
    // const response = await api.post('/HotelBookingSystem/GetBookingReport', {})
    
    // // Extract data handling your standard wrapper
    // bookings.value = response.data?.data || []
    bookings.value = await bookingService.getMyBookings()
  } catch (err: any) {
    console.error('❌ Failed to load bookings:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to retrieve your transaction history.'
  } finally {
    loading.value = false
  }
}

// Format status badges with safe utility classes
const getStatusClass = (status: string) => {
  const s = status?.toLowerCase()
  if (s === 'confirmed' || s === 'checkedin') return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-gray-50 text-gray-500 border-gray-200' // Cancelled / CheckedOut
}

// Programmatic route navigation to a focused detail sheet view
const viewDetail = (bookingId: number) => {
  router.push({
    name: 'booking-detail',
    params: { id: bookingId }
  })
}

onMounted(loadMyBookings)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">My Bookings</h1>
      <p class="text-gray-500 mt-1">Manage your upcoming stays, itineraries, and past booking receipts.</p>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 font-medium">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-20 text-xl font-medium text-gray-400">
      Loading your reservation files...
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-16 bg-white rounded-3xl border border-dashed p-8">
      <div class="text-6xl mb-4">🧳</div>
      <h3 class="text-xl font-bold text-gray-900">No bookings found</h3>
      <p class="text-gray-500 mt-1 max-w-sm mx-auto">You haven't scheduled any stays yet. Let's explore top worldwide properties!</p>
      <button @click="router.push('/hotels')" class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-100">
        Browse Available Hotels
      </button>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="b in bookings" 
        :key="b.bookingID"
        @click="viewDetail( b.bookingID)"
        class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        
        <div class="flex items-start gap-4">
          <div class="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold font-mono">
            🏨
          </div>
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h3 class="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ b.hotelName }}
              </h3>
              <span 
                :class="getStatusClass(b.status)" 
                class="px-3 py-1 rounded-full text-xs font-bold uppercase border tracking-wider">
                {{ b.status }}
              </span>
            </div>
            
            <p class="text-sm text-gray-500 font-medium mt-1">
              📍 {{ b.city || 'Hong Kong' }} • Rooms Booked: <span class="font-semibold font-mono text-gray-700">{{ b.RoomsBooked || b.roomsBooked }}</span>
            </p>
            
            <p class="text-sm text-gray-400 mt-2 flex items-center gap-1 font-medium">
              📅 <span class="text-gray-600">{{ b.CheckIn_Friendly || b.CheckInFriendly || b.checkInDate }}</span> 
              ➔ 
              <span class="text-gray-600">{{ b.CheckOut_Friendly || b.CheckOutFriendly || b.checkOutDate }}</span>
            </p>
          </div>
        </div>

        <div class="flex md:flex-col items-between justify-between md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-solid border-gray-100">
          <div>
            <div class="text-xs text-gray-400 font-bold uppercase tracking-wider md:text-right">Total Paid</div>
            <div class="text-2xl font-black text-emerald-600 mt-0.5">
              {{ b.totalAmount_HKD || b.totalAmountHkd || 'HKD ' + b.totalAmount }}
            </div>
          </div>
          <button class="md:mt-3 px-4 py-2 text-sm font-semibold bg-gray-50 hover:bg-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 text-gray-600 rounded-xl transition-colors">
            Manage Stay ➔
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
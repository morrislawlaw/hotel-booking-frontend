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

<!-- <script setup lang="ts">
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
</template> -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const bookings = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const loadMyBookings = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Hits your backend GetBookingReport endpoint
    // Sending an empty object matches your backend's BookingReportFilterDto default expectation
    const response = await api.post('/HotelBookingSystem/GetBookingReport', {})
    
    // Extract data handling your standard wrapper
    bookings.value = response.data?.data || []
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
        :key="b.BookingID || b.bookingID"
        @click="viewDetail(b.BookingID || b.bookingID)"
        class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        
        <div class="flex items-start gap-4">
          <div class="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold font-mono">
            🏨
          </div>
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h3 class="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ b.HotelName || b.hotelName }}
              </h3>
              <span 
                :class="getStatusClass(b.Status)" 
                class="px-3 py-1 rounded-full text-xs font-bold uppercase border tracking-wider">
                {{ b.Status }}
              </span>
            </div>
            
            <p class="text-sm text-gray-500 font-medium mt-1">
              📍 {{ b.City || b.city || 'Hong Kong' }} • Rooms Booked: <span class="font-semibold font-mono text-gray-700">{{ b.RoomsBooked || b.roomsBooked }}</span>
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
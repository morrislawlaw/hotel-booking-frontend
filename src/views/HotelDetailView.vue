<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const hotelId = Number(route.params.id)
const checkInDate = ref(route.query.checkIn as string || '')
const checkOutDate = ref(route.query.checkOut as string || '')

const hotel = ref<any>(null)
const availableRooms = ref<any[]>([])
const selectedRooms = ref<number[]>([])
const loading = ref(false)
const bookingLoading = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// 1. Load available rooms inside this hotel property
const loadHotelDetail = async () => {
  loading.value = true
  try {
    const payload = {
      hotelId: hotelId,
      checkInDate: checkInDate.value,
      checkOutDate: checkOutDate.value,
      roomTypeId: null
    }

    console.log('📤 Check Availability Payload:', payload)
    const res = await api.post('/HotelBookingSystem/CheckRoomAvailability', payload)
    console.log('📥 Check Availability Response:', res.data)

    availableRooms.value = res.data?.data || res.data || []

    if (availableRooms.value.length > 0) {
      // Safeguard case-sensitivity returned from the Stored Procedure
      const primaryRoom = availableRooms.value[0]
      hotel.value = {
        hotelName: primaryRoom.hotelName || primaryRoom.HotelName,
        city: primaryRoom.city || primaryRoom.City || 'Hong Kong'
      }
    }
  } catch (err: any) {
    console.error('❌ Load Error:', err)
  } finally {
    loading.value = false
  }
}

// ==================== 🔥 DYNAMIC GUEST SIZE CAPACITY FILTER ====================
const filteredRooms = computed(() => {
  const searchedGuests = Number(route.query.guests || 2)
  console.log(`🔍 Filtering available hotel rooms for guest size capacity: ${searchedGuests}`)
  
  return availableRooms.value.filter(room => {
    const maxPax = room.MaxOccupancy || room.maxOccupancy || 0
    return maxPax >= searchedGuests
  })
})

// ==================== 🚀 INITIATE STRIPE PAYMENTS HANDSHAKE ====================
const createBooking = async () => {
  if (selectedRooms.value.length === 0) {
    message.value = { type: 'error', text: 'Please select at least one room before continuing.' }
    return
  }

  // Security Gate: Ensure an active login token payload exists before opening checkouts
  if (!userStore.isAuthenticated) {
    alert('You must sign in or create an account to complete your hotel reservation.')
    router.push('/login')
    return
  }

  const payload = {
    checkInDate: checkInDate.value,
    checkOutDate: checkOutDate.value,
    roomIDs: selectedRooms.value.join(',')
  }

  bookingLoading.value = true
  message.value = null

  try {
    console.log('🚀 Forwarding transit payload metadata to Stripe controller gateway:', payload)
    
    // Call your new dedicated payment controller
    const response = await api.post('/StripePayment/CreateCheckoutSession', payload)
    const checkoutUrl = response.data?.checkoutUrl || response.data?.data?.checkoutUrl

    if (checkoutUrl) {
      message.value = { type: 'success', text: 'Secure checkout session created! Redirecting to Stripe...' }
      
      // 💥 THE REDIRECTION HANDSHAKE: Hand off the session focus completely to Stripe's payment network
      window.location.href = checkoutUrl
    } else {
      throw new Error('Failed to parse a valid checkout link parameter map from server.')
    }
  } catch (err: any) {
    console.error('❌ Stripe processing failure details:', err)
    const msg = err.response?.data?.message || err.message || 'Payment initiation failed.'
    message.value = { type: 'error', text: `❌ ${msg}` }
  } finally {
    bookingLoading.value = false
  }
}

const toggleRoom = (roomId: number) => {
  if (selectedRooms.value.includes(roomId)) {
    selectedRooms.value = selectedRooms.value.filter(id => id !== roomId)
  } else {
    selectedRooms.value.push(roomId)
  }
}

// Compute total price dynamically using case-insensitive property fallbacks
const totalPrice = computed(() => {
  const days = checkInDate.value && checkOutDate.value 
    ? Math.max(1, Math.ceil((new Date(checkOutDate.value).getTime() - new Date(checkInDate.value).getTime()) / 86400000))
    : 0

  const selected = availableRooms.value.filter(r => {
    const rId = r.RoomID || r.roomID || r.roomId
    return selectedRooms.value.includes(rId)
  })

  return selected.reduce((sum, r) => {
    const price = r.BasePricePerNight || r.basePricePerNight || 0
    return sum + price * days
  }, 0)
})

onMounted(loadHotelDetail)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <button @click="router.back()" class="mb-6 flex items-center gap-2 text-blue-600 hover:underline">
      ← Back to Hotels
    </button>

    <div v-if="loading" class="text-center py-20 text-xl font-medium text-gray-400">
      Loading property configurations...
    </div>

    <div v-else>
      <h1 v-if="hotel" class="text-4xl font-extrabold tracking-tight text-gray-900">{{ hotel.hotelName }}</h1>
      <p class="text-gray-500 font-medium mt-1">📍 {{ hotel?.city }}</p>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        <div class="lg:col-span-7">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Available Configurations ({{ filteredRooms.length }})
          </h2>
          
          <div class="space-y-4">
            <div 
              v-for="room in filteredRooms" 
              :key="room.RoomID || room.roomID"
              @click="toggleRoom(room.RoomID || room.roomID)"
              :class="selectedRooms.includes(room.RoomID || room.roomID) ? 'ring-2 ring-blue-600 bg-blue-50 border-blue-300' : 'border-gray-200'"
              class="border bg-white rounded-3xl p-6 cursor-pointer hover:shadow-xl transition-all border-solid">
              
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-bold text-xl text-gray-900">
                    Room {{ room.RoomNumber || room.roomNumber }} — {{ room.TypeName || room.typeName }}
                  </h3>
                  <p class="text-gray-500 text-sm font-medium mt-1">
                    Max {{ room.MaxOccupancy || room.maxOccupancy }} guests allowed
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-3xl font-extrabold text-emerald-600">
                    HKD {{ room.BasePricePerNight || room.basePricePerNight }}
                  </span>
                  <p class="text-xs text-gray-400 font-bold uppercase mt-1">per night</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sticky top-6">
            <h3 class="font-bold text-xl text-gray-900 mb-6">Reservation Summary</h3>
            
            <div class="space-y-3 text-sm font-medium">
              <div class="flex justify-between text-gray-500"><span>Check-in Date</span><span class="text-gray-900">{{ checkInDate }}</span></div>
              <div class="flex justify-between text-gray-500"><span>Check-out Date</span><span class="text-gray-900">{{ checkOutDate }}</span></div>
              <div class="flex justify-between text-gray-500"><span>Guests Filtered</span><span class="text-gray-900">{{ route.query.guests || 2 }} Travelers</span></div>
              <div class="flex justify-between text-gray-500"><span>Rooms Selected</span><span class="text-gray-900">{{ selectedRooms.length }} Assigned</span></div>
              <div class="flex justify-between text-xl font-extrabold border-t border-solid pt-4 text-gray-900">
                <span>Total Price</span>
                <span class="text-emerald-600">HKD {{ totalPrice.toLocaleString() }}</span>
              </div>
            </div>

            <button 
              @click="createBooking"
              :disabled="selectedRooms.length === 0 || bookingLoading"
              class="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-blue-100">
              {{ bookingLoading ? 'Creating Secure Payment Session...' : 'Confirm Booking & Pay' }}
            </button>

            <div v-if="message" 
                 :class="message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                 class="mt-4 p-4 rounded-2xl text-sm font-medium text-center">
              {{ message.text }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
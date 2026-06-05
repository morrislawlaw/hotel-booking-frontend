<!-- <script setup lang="ts">
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
      hotel.value = {
        hotelName: availableRooms.value[0].hotelName,
        city: availableRooms.value[0].city || 'Hong Kong'
      }
    }
  } catch (err: any) {
    console.error('❌ Load Error:', err)
  } finally {
    loading.value = false
  }
}

// ==================== CREATE BOOKING ====================
const createBooking = async () => {
  if (selectedRooms.value.length === 0) {
    message.value = { type: 'error', text: 'Please select at least one room' }
    return
  }

  const payload = {
    customerId: 1,
    checkInDate: checkInDate.value,
    checkOutDate: checkOutDate.value,
    roomIDs: selectedRooms.value.join(','),
    paymentSuccess: true
  }

  bookingLoading.value = true
  message.value = null

  try {
    const response = await api.post('/HotelBookingSystem/CreateBooking', payload)
    const result = response.data?.data || response.data

    // Redirect to confirmation page with data
    router.push({
      name: 'booking-confirmation',
      query: {
        bookingId: result.newBookingID || result.bookingID || result.BookingID || 'N/A',
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value,
        total: result.totalAmount || totalPrice.value
      }
    })
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Booking failed'
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

const totalPrice = computed(() => {
  const days = checkInDate.value && checkOutDate.value 
    ? Math.max(1, Math.ceil((new Date(checkOutDate.value).getTime() - new Date(checkInDate.value).getTime()) / 86400000))
    : 0
  const selected = availableRooms.value.filter(r => selectedRooms.value.includes(r.roomID || r.roomId))
  return selected.reduce((sum, r) => sum + (r.basePricePerNight || 0) * days, 0)
})

// This is the function linked to your "Book Now" or "Confirm Booking" button
const handleProcessToPayment = () => {
  
  // 🚀 ADD THE LOCAL GUARD HERE
  if (!userStore.isAuthenticated) {
    alert('You must create an account or sign in to complete your booking reservation.')
    
    // Push them straight to your new login form
    router.push('/login')
  } else {
    // User is logged in! Proceed smoothly to your payment gateway API
    console.log('Proceeding securely to checkout pipeline with token...')
    proceedToPaymentGateway() 
  }
}

const proceedToPaymentGateway = () => {
  // Your existing logic that redirects the user to your payment window
}

onMounted(loadHotelDetail)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <button @click="router.back()" class="mb-6 flex items-center gap-2 text-blue-600 hover:underline">← Back to Hotels</button>

    <h1 v-if="hotel" class="text-4xl font-bold">{{ hotel.hotelName }}</h1>
    <p class="text-gray-600">{{ hotel?.city }}</p>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      <!-- Rooms List -->
       <!--
      <div class="lg:col-span-7">
        <h2 class="text-2xl font-semibold mb-4">Available Rooms ({{ availableRooms.length }})</h2>
        <div class="space-y-4">
          <div v-for="room in availableRooms" :key="room.roomID"
               @click="toggleRoom(room.roomID)"
               :class="selectedRooms.includes(room.roomID) ? 'ring-2 ring-blue-600 bg-blue-50' : ''"
               class="border rounded-3xl p-6 cursor-pointer hover:shadow-xl transition-all">
            <div class="flex justify-between">
              <div>
                <h3 class="font-semibold">{{ room.roomNumber }} - {{ room.typeName }}</h3>
                <p class="text-gray-500">Max {{ room.maxOccupancy }} guests</p>
              </div>
              <div class="text-right">
                <span class="text-3xl font-bold text-emerald-600">HKD {{ room.basePricePerNight }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Summary -->
      <!--
      <div class="lg:col-span-5">
        <div class="bg-white rounded-3xl shadow p-6 sticky top-6">
          <h3 class="font-semibold text-xl mb-6">Booking Summary</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between"><span class="text-gray-600">Check-in</span><span>{{ checkInDate }}</span></div>
            <div class="flex justify-between"><span class="text-gray-600">Check-out</span><span>{{ checkOutDate }}</span></div>
            <div class="flex justify-between font-medium"><span>Rooms Selected</span><span>{{ selectedRooms.length }}</span></div>
            <div class="flex justify-between text-xl font-bold border-t pt-3"><span>Total</span><span>HKD {{ totalPrice.toLocaleString() }}</span></div>
          </div>

          <button 
            @click="createBooking"
            :disabled="selectedRooms.length === 0 || bookingLoading"
            class="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-2xl">
            {{ bookingLoading ? 'Processing...' : 'Confirm Booking' }}
          </button>

          <div v-if="message" 
               :class="message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
               class="mt-4 p-4 rounded-2xl text-sm">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->

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

    // if (availableRooms.value.length > 0) {
    //   hotel.value = {
    //     hotelName: availableRooms.value[0].hotelName,
    //     city: availableRooms.value[0].city || 'Hong Kong'
    //   }
    // }
    if (availableRooms.value.length > 0) {
      // Handle fallbacks for case-sensitive properties cleanly
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

// ==================== CHECKOUT LOGIC GUARD SWITCH ====================
// const handleProcessToPayment = () => {
//   if (selectedRooms.value.length === 0) {
//     message.value = { type: 'error', text: 'Please select at least one room before continuing.' }
//     return
//   }

//   // Transaction Guard Check
//   if (!userStore.isAuthenticated) {
//     alert('You must create an account or sign in to complete your hotel booking.')
//     router.push('/login')
//   } else {
//     // Authenticated! Proceed with your processing flow execution
//     createBooking()
//   }
// }

// ==================== 🔥 STEP D: THE DYNAMIC GUEST FILTER ====================
// This reactive property filters your rooms list automatically based on the user's search
const filteredRooms = computed(() => {
  // Grab the number of guests from the URL query string (defaulting to 2 if missing)
  const searchedGuests = Number(route.query.guests || 2)
  console.log(`🔍 Filtering available hotel rooms for guest size capacity: ${searchedGuests}`)
  
  // Filter the array down to options where maximum occupancy can support the searched count
  return availableRooms.value.filter(room => {
    const maxPax = room.MaxOccupancy || room.maxOccupancy || 0
    return maxPax >= searchedGuests
  })
})

// ==================== CREATE BOOKING ====================
const createBooking = async () => {
  if (selectedRooms.value.length === 0) {
    message.value = { type: 'error', text: 'Please select at least one room before continuing.' }
    return
  }

  // Ownership state validation guard
  if (!userStore.isAuthenticated) {
    alert('You must create an account or sign in to complete your booking reservation.')
    router.push('/login')
    return
  }

  const payload = {
    // The backend extracts the identity context claim from your Bearer token string,
    // so we can pass their email variable text directly here
    // customerEmail: userStore.userEmail, 
    checkInDate: checkInDate.value,
    checkOutDate: checkOutDate.value,
    roomIDs: selectedRooms.value.join(','),
    paymentSuccess: true // Temporary baseline default until Stripe session integration
  }

  bookingLoading.value = true
  message.value = null

  try {
    const response = await api.post('/HotelBookingSystem/CreateBooking', payload)
    const result = response.data?.data || response.data

    router.push({
      name: 'booking-confirmation',
      query: {
        bookingId: result.newBookingID || result.bookingID || result.BookingID || 'N/A',
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value,
        total: result.totalAmount || totalPrice.value
      }
    })
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Booking validation processing failed.'
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

// Compute total pricing dynamically based on checkout dates context
const totalPrice = computed(() => {
  const days = checkInDate.value && checkOutDate.value 
    ? Math.max(1, Math.ceil((new Date(checkOutDate.value).getTime() - new Date(checkInDate.value).getTime()) / 86400000))
    : 0

  // const selected = availableRooms.value.filter(r => selectedRooms.value.includes(r.roomID || r.roomId))
  const selected = availableRooms.value.filter(r => {
    const rId = r.RoomID || r.roomID || r.roomId
    return selectedRooms.value.includes(rId)
  })

  return selected.reduce((sum, r) => {
    const price = r.BasePricePerNight || r.basePricePerNight || 0
    return sum + price * days
  }, 0)

  // return selected.reduce((sum, r) => sum + (r.basePricePerNight || 0) * days, 0)
})

onMounted(loadHotelDetail)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <button @click="router.back()" class="mb-6 flex items-center gap-2 text-blue-600 hover:underline">
      ← Back to Hotels
    </button>

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
            <div class="flex justify-between text-gray-500"><span>Guests Selected</span><span class="text-gray-900">{{ route.query.guests || 2 }} Travelers</span></div>
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
            {{ bookingLoading ? 'Processing Placement...' : 'Confirm Booking & Pay' }}
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
</template>

<!-- <template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <button @click="router.back()" class="mb-6 flex items-center gap-2 text-blue-600 hover:underline">← Back to Hotels</button>

    <h1 v-if="hotel" class="text-4xl font-extrabold tracking-tight text-gray-900">{{ hotel.hotelName }}</h1>
    <p class="text-gray-500 font-medium mt-1">{{ hotel?.city }}</p>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      <div class="lg:col-span-7">
        <h2 class="text-2xl font-semibold mb-4">Available Rooms ({{ availableRooms.length }})</h2>
        <div class="space-y-4">
          <div v-for="room in availableRooms" :key="room.roomID"
               @click="toggleRoom(room.RoomID || room.roomID)"
               :class="selectedRooms.includes(room.roomID) ? 'ring-2 ring-blue-600 bg-blue-50' : ''"
               class="border rounded-3xl p-6 cursor-pointer hover:shadow-xl transition-all">
            <div class="flex justify-between">
              <div>
                <h3 class="font-semibold">{{ room.roomNumber }} - {{ room.typeName }}</h3>
                <p class="text-gray-500">Max {{ room.maxOccupancy }} guests</p>
              </div>
              <div class="text-right">
                <span class="text-3xl font-bold text-emerald-600">HKD {{ room.basePricePerNight }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="bg-white rounded-3xl shadow p-6 sticky top-6">
          <h3 class="font-semibold text-xl mb-6">Booking Summary</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between"><span class="text-gray-600">Check-in</span><span>{{ checkInDate }}</span></div>
            <div class="flex justify-between"><span class="text-gray-600">Check-out</span><span>{{ checkOutDate }}</span></div>
            <div class="flex justify-between font-medium"><span>Rooms Selected</span><span>{{ selectedRooms.length }}</span></div>
            <div class="flex justify-between text-xl font-bold border-t pt-3"><span>Total</span><span>HKD {{ totalPrice.toLocaleString() }}</span></div>
          </div>

          <button 
            @click="handleProcessToPayment"
            :disabled="selectedRooms.length === 0 || bookingLoading"
            class="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-2xl transition-colors">
            {{ bookingLoading ? 'Processing...' : 'Confirm Booking & Pay' }}
          </button>

          <div v-if="message" 
               :class="message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
               class="mt-4 p-4 rounded-2xl text-sm">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->
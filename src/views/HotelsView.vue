<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const rooms = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const loadAvailableRooms = async () => {
  const checkIn = route.query.checkIn as string
  const checkOut = route.query.checkOut as string

  if (!checkIn || !checkOut) {
    error.value = 'Check-in and Check-out dates are required'
    return
  }

  const requestBody = {
    hotelId: null,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    roomTypeId: null
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/HotelBookingSystem/CheckRoomAvailability', requestBody)
    rooms.value = response.data?.data || response.data || []
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to load rooms'
  } finally {
    loading.value = false
  }
}

// Navigate to Hotel Detail dynamically based on selected room metadata
const goToHotelDetail = (room: any) => {
  console.log('📦 Raw Room Object Selected:', room)
  
  // 🔥 FIX: Extract the uppercase 'HotelID' returned from your SQL stored procedure response
  const selectedHotelId = room.hotelID || room.HotelID || room.hotelId || 1
  
  console.log(`🚀 Routing to Hotel ID target link path: /hotel/${selectedHotelId}`)

  router.push({
    name: 'hotel-detail',
    params: { id: selectedHotelId },
    query: {
      checkIn: route.query.checkIn,
      checkOut: route.query.checkOut,
      roomId: room.roomID || room.RoomID || room.roomId
    }
  })
}

onMounted(loadAvailableRooms)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold">Available Rooms</h1>
      <button @click="loadAvailableRooms" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-white">
        🔄 Refresh
      </button>
    </div>

    <div v-if="error" class="bg-red-50 p-4 rounded-2xl mb-6 text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-20">Loading available rooms...</div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="room in rooms" 
        :key="room.roomID"
        @click="goToHotelDetail(room)"
        class="bg-white rounded-3xl shadow hover:shadow-2xl cursor-pointer transition-all overflow-hidden group">
        
        <div class="h-56 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-7xl text-white">
          🛏️
        </div>
        
        <div class="p-6">
          <h3 class="font-bold text-xl">{{ room.hotelName }}</h3>
          <p class="text-gray-600">{{ room.roomNumber }} • {{ room.typeName }}</p>
          
          <div class="mt-4 flex justify-between items-baseline">
            <span class="text-3xl font-bold text-emerald-600">HKD {{ room.basePricePerNight }}</span>
            <span class="text-sm text-gray-500">Max {{ room.maxOccupancy }} pax</span>
          </div>

          <button class="mt-6 w-full py-3.5 bg-blue-600 group-hover:bg-blue-700 text-white rounded-2xl font-medium transition-all">
            View Details & Book
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hotelService } from '@/services/hotelService'
import type { AvailableHotelQueryResultDto } from '@/types'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

//const hotels = ref<any[]>([])
const hotels = ref<AvailableHotelQueryResultDto[]>([])
const loading = ref(false)
const error = ref('')

// const loadAvailableHotels = async () => {
//   const checkIn = route.query.checkIn as string
//   const checkOut = route.query.checkOut as string
//   const guestCount = Number(route.query.guests || 2)

//   if (!checkIn || !checkOut) {
//     error.value = 'Check-in and Check-out dates are required parameters.'
//     return
//   }

//   loading.value = true
//   error.value = ''

//   try {
//     // Hits our new endpoint grouping items by hotel
//     const response = await api.post('/HotelBookingSystem/GetAvailableHotelsList', {
//       checkInDate: checkIn,
//       checkOutDate: checkOut,
//       guests: guestCount
//     })
    
//     hotels.value = response.data?.data || []
    
//     if (hotels.value.length === 0) {
//       error.value = 'No hotels found matching your destination, availability dates, or guest count capacity constraints.'
//     }
//   } catch (err: any) {
//     error.value = err.response?.data?.message || err.message || 'Failed to aggregate available properties.'
//   } finally {
//     loading.value = false
//   }
// }
const loadAvailableHotels = async () => {
  const checkIn = route.query.checkIn as string
  const checkOut = route.query.checkOut as string
  const guestCount = Number(route.query.guests || 2)

  if (!checkIn || !checkOut) {
    error.value = 'Check-in and Check-out dates are required parameters.'
    return
  }

  loading.value = true
  try {
    // 2. Consume the isolated service layer cleanly
    hotels.value = await hotelService.getAvailableHotels({
      CheckInDate: checkIn,
      CheckOutDate: checkOut,
      Guests: guestCount
    })
    
    if (hotels.value.length === 0) {
      error.value = 'No available properties matched your criteria.'
    }
  } catch (err: any) {
    error.value = 'Failed to load booking properties.'
  } finally {
    loading.value = false
  }
}

// Routes to the Hotel Detail view, passing the HotelID and search parameters
const goToHotelDetail = (hotel: any) => {
  router.push({
    name: 'hotel-detail',
    params: { id: hotel.hotelID || hotel.HotelID },
    query: {
      checkIn: route.query.checkIn,
      checkOut: route.query.checkOut,
      guests: route.query.guests
    }
  })
}

onMounted(loadAvailableHotels)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Available Hotel Properties</h1>
        <p class="text-sm text-gray-500 mt-1">Showing filtered options for {{ route.query.guests || 2 }} guests</p>
      </div>
      <button @click="loadAvailableHotels" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-white font-medium transition-colors">
        🔄 Refresh Search
      </button>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 font-medium">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-20 text-xl font-medium text-gray-400">
      Searching and sorting top hotels...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="hotel in hotels" 
        :key="hotel.hotelID || hotel.HotelID"
        @click="goToHotelDetail(hotel)"
        class="bg-white rounded-3xl shadow-md hover:shadow-2xl cursor-pointer transition-all overflow-hidden group border border-gray-100 flex flex-col justify-between">
        
        <div class="h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-6xl text-white relative">
          🏢
          <div class="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
            ★ {{ hotel.starRating || hotel.StarRating || 4 }}
          </div>
        </div>
        
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">
              {{ hotel.hotelName || hotel.HotelName }}
            </h3>
            <p class="text-gray-500 font-medium text-sm mt-1">
              📍 {{ hotel.address || hotel.Address }}, {{ hotel.city || hotel.City }}
            </p>
          </div>
          
          <div class="mt-6 border-t pt-4">
            <div class="text-xs text-gray-400 uppercase font-bold tracking-wider">Starting From</div>
            <div class="flex justify-between items-baseline mt-1">
              <span class="text-3xl font-extrabold text-emerald-600">
                HKD {{ (hotel.startingPricePerNight || hotel.StartingPricePerNight).toLocaleString() }}
              </span>
              <span class="text-sm text-gray-500 font-medium">/ night</span>
            </div>
            
            <button class="mt-4 w-full py-3.5 bg-blue-600 group-hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-50">
              View Available Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
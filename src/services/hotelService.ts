import api from '@/services/api'
import type { 
  HotelSearchInputDto, 
  AvailableHotelQueryResultDto, 
  RoomAvailabilityDto 
} from '@/types'

export const hotelService = {
  /**
   * Fetches all hotel properties matching check-in dates and guest counts
   * Target EndPoint: /HotelBookingSystem/GetAvailableHotelsList
   */
  async getAvailableHotels(searchParams: HotelSearchInputDto): Promise<AvailableHotelQueryResultDto[]> {
    try{
    const response = await api.post('/HotelBookingSystem/GetAvailableHotelsList', {
      checkInDate: searchParams.CheckInDate,
      checkOutDate: searchParams.CheckOutDate,
      guests: searchParams.Guests
    })

    // Returns the clean payload collection directly to the view
    return response.data?.data || []
    }catch (err: any) {
      console.error('📊 Telemetry Log [HotelService]:', err);
      
      // Extract the server message if it exists, otherwise use a clean fallback string
      const serverMessage = err.response?.data?.message || 'The booking service is temporarily unavailable.';
      
      // Throw a clean string or custom Error object up to the component
      throw new Error(serverMessage);
    }
  },

  /**
   * Queries real-time room availability for a single chosen hotel property
   * Target EndPoint: /HotelBookingSystem/CheckRoomAvailability
   */
  async checkRoomAvailability(payload: {
    hotelId: number
    checkInDate: string
    checkOutDate: string
  }): Promise<RoomAvailabilityDto[]> {
    const response = await api.post('/HotelBookingSystem/CheckRoomAvailability', {
      hotelId: payload.hotelId,
      checkInDate: payload.checkInDate,
      checkOutDate: payload.checkOutDate,
      roomTypeId: null // Matching your backend controller's expectations
    })

    return response.data?.data || []
  }
}
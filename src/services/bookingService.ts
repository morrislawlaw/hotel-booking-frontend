import api from '@/services/api'
import type { 
    BookingDetailDto, 
    BookingReportItemDto,
    RoomAvailabilityQuery, 
    RoomAvailabilityDto, 
    StripeCheckoutPayload, 
    StripeCheckoutResponse
 } from '@/types/booking'

export const bookingService = {
  async getBookingDetail(bookingId: number): Promise<BookingDetailDto> {
    try {
      const res = await api.post('/HotelBookingSystem/GetBookingDetail', { bookingID: bookingId })
      return res.data?.data || res.data
    } catch (err: any) {
      console.error('📊 Telemetry Log [BookingService - GetDetail]:', err)
      throw new Error(err.response?.data?.message || 'Failed to load booking properties.')
    }
  },

  async getMyBookings(): Promise<BookingReportItemDto[]> {
    try {
      const response = await api.post('/HotelBookingSystem/GetBookingReport', {})
      return response.data?.data || []
    } catch (err: any) {
      console.error('📊 Telemetry Log [BookingService - GetReport]:', err)
      throw new Error(err.response?.data?.message || err.message || 'Failed to retrieve transaction records.')
    }
  },

  async cancelBooking(bookingId: number): Promise<void> {
    try {
      const res = await api.post('/HotelBookingSystem/CancelBooking', { bookingID: bookingId })
      if (res.data && res.data.code !== 0 && res.data.message) {
        throw new Error(res.data.message)
      }
    } catch (err: any) {
      console.error('📊 Telemetry Log [BookingService - Cancel]:', err)
      throw new Error(err.response?.data?.message || err.message || 'Cancel operation failed.')
    }
  },

  async checkInBooking(bookingId: number): Promise<void> {
    try {
      const res = await api.post('/HotelBookingSystem/CheckInBooking', { bookingID: bookingId })
      if (res.data && res.data.code !== 0 && res.data.message) {
        throw new Error(res.data.message)
      }
    } catch (err: any) {
      console.error('📊 Telemetry Log [BookingService - CheckIn]:', err)
      throw new Error(err.response?.data?.message || err.message || 'Check-in operation failed.')
    }
  },

  async checkOutBooking(bookingId: number): Promise<void> {
    try {
      const res = await api.post('/HotelBookingSystem/CheckOutBooking', { bookingID: bookingId })
      if (res.data && res.data.code !== 0 && res.data.message) {
        throw new Error(res.data.message)
      }
    } catch (err: any) {
      console.error('📊 Telemetry Log [BookingService - CheckOut]:', err)
      throw new Error(err.response?.data?.message || err.message || 'Check-out operation failed.')
    }
  },
  async checkRoomAvailability(query: RoomAvailabilityQuery): Promise<RoomAvailabilityDto[]> {
    try {
      const res = await api.post('/HotelBookingSystem/CheckRoomAvailability', query)
      const data = res.data?.data || res.data || []
      
      return data.map((room: any) => ({
        hotelID: room.hotelID ?? room.hotelId ?? room.HotelID,
        hotelName: room.hotelName ?? room.HotelName ?? 'Premium Hotel',
        roomID: room.roomID ?? room.roomId ?? room.RoomID,
        roomNumber: room.roomNumber ?? room.RoomNumber,
        typeName: room.typeName ?? room.TypeName,
        basePricePerNight: room.basePricePerNight ?? room.BasePricePerNight ?? 0,
        maxOccupancy: room.maxOccupancy ?? room.MaxOccupancy
      }))
    } catch (err: any) {
      console.error('📊 Telemetry Log [BookingService - CheckAvailability]:', err)
      throw new Error(err.response?.data?.message || 'Failed to check room availability configuration lists.')
    }
  },

  async createCheckoutSession(payload: StripeCheckoutPayload): Promise<StripeCheckoutResponse> {
    try {
      const response = await api.post('/StripePayment/CreateCheckoutSession', payload)
      const checkoutUrl = response.data?.checkoutUrl || response.data?.data?.checkoutUrl
      
      if (!checkoutUrl) {
        throw new Error('Failed to parse valid checkout link parameter map from server response.')
      }
      return { checkoutUrl }
    } catch (err: any) {
      console.error('📊 Telemetry Log [BookingService - StripePayment]:', err)
      throw new Error(err.response?.data?.message || err.message || 'Payment initiation failed.')
    }
  }
}
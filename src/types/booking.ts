// Input parameter model for hotel searches
export interface HotelSearchInputDto {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}

// Return payload shape from /HotelBookingSystem/GetAvailableHotelsList
export interface AvailableHotelQueryResultDto {
  hotelID: number;
  hotelName: string;
  city: string;
  country: string;
  starRating?: number | null;
  address?: string | null;
  startingPricePerNight: number;
}

// Room unit data structural definition inside HotelDetailView.vue
export interface RoomAvailabilityDto {
  hotelID: number;
  hotelName: string;
  roomID: number;
  roomNumber: string;
  typeName: string;
  basePricePerNight: number;
  maxOccupancy?: number | null;
}

// Unified input parameter object for availability checks
export interface RoomAvailabilityQuery {
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
  roomTypeId: number | null;
}

export interface StripeCheckoutPayload {
  checkInDate: string;
  checkOutDate: string;
  roomIDs: string;
}

export interface StripeCheckoutResponse {
  checkoutUrl: string;
}

export interface BookingDetailDto {
  bookingID: number;
  hotelName: string;
  city: string;
  country?: string | null;
  status: string;
  customerName: string;
  email: string;
  phone?: string | null;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  roomsBooked: string;
  totalAmount: number;
}

export interface BookingReportItemDto {
  bookingID: number;
  hotelName: string;
  status: string;
  city?: string | null;
  RoomsBooked?: string | null;
  roomsBooked?: string | null;
  CheckIn_Friendly?: string | null;
  CheckInFriendly?: string | null;
  checkInDate: string;
  CheckOut_Friendly?: string | null;
  CheckOutFriendly?: string | null;
  checkOutDate: string;
  totalAmount_HKD?: string | null;
  totalAmountHkd?: string | null;
  totalAmount: number;
}
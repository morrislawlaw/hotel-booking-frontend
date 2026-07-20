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

// Combined frontend-friendly model for rooms
export interface RoomModel extends RoomAvailabilityDto {
  roomID: number;
  roomNumber: string;
  typeName: string;
  basePricePerNight: number;
  maxOccupancy?: number | null;
}
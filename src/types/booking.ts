// Input parameter model for hotel searches
export interface HotelSearchInputDto {
  CheckInDate: string;
  CheckOutDate: string;
  Guests: number;
}

// Return payload shape from /HotelBookingSystem/GetAvailableHotelsList
export interface AvailableHotelQueryResultDto {
  HotelID: number;
  HotelName: string;
  City: string;
  Country: string;
  StarRating?: number | null;
  Address?: string | null;
  StartingPricePerNight: number;
}

// Combined frontend-friendly model to handle both casing formats found in your view scripts
export interface HotelModel extends AvailableHotelQueryResultDto {
  // Runtime fallbacks to keep templates from throwing undefined errors
  hotelID: number;
  hotelName: string;
  address?: string | null;
  city: string;
  starRating?: number | null;
  startingPricePerNight: number;
}

// Room unit data structural definition inside HotelDetailView.vue
export interface RoomAvailabilityDto {
  HotelID: number;
  HotelName: string;
  RoomID: number;
  RoomNumber: string;
  TypeName: string;
  BasePricePerNight: number;
  MaxOccupancy?: number | null;
}

// Combined frontend-friendly model for rooms
export interface RoomModel extends RoomAvailabilityDto {
  roomID: number;
  roomNumber: string;
  typeName: string;
  basePricePerNight: number;
  maxOccupancy?: number | null;
}
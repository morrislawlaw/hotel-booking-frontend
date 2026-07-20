export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';

// Maps back to CreateBookingInputDto
export interface CreateBookingInputDto {
  CheckInDate: string;
  CheckOutDate: string;
  RoomIDs: string; // Comma separated e.g., "1,5,12"
  PaymentSuccess: boolean;
}

// Maps back to CancelBookingInputDto
export interface CancelBookingInputDto {
  BookingID: number;
  Reason?: string | null;
}

// Represents the transaction items processed inside your report views
export interface BookingReportItem {
  BookingID: number;
  customerID: string;
  HotelName: string;
  City?: string;
  RoomsBooked?: number;
  CheckInDate: string;
  CheckOutDate: string;
  TotalAmount: number;
  status: BookingStatus;
  
  // Runtime UI layout property variants found in MyBookingsView template loop mappings
  bookingID: number;
  hotelName: string;
  city?: string;
  roomsBooked?: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  
  CheckIn_Friendly?: string;
  CheckInFriendly?: string;
  CheckOut_Friendly?: string;
  CheckOutFriendly?: string;
  totalAmount_HKD?: string;
  totalAmountHkd?: string;
}
export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';

// Maps back to CreateBookingInputDto
export interface CreateBookingInputDto {
  checkInDate: string;
  checkOutDate: string;
  roomIDs: string; // Comma separated e.g., "1,5,12"
  paymentSuccess: boolean;
}

// Maps back to CancelBookingInputDto
export interface CancelBookingInputDto {
  bookingID: number;
  reason?: string | null;
}

// Represents the transaction items processed inside your report views
export interface BookingReportItem {
  bookingID: number;
  customerID: string;
  hotelName: string;
  city?: string;
  roomsBooked?: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  
  checkIn_Friendly?: string;
  checkInFriendly?: string;
  checkOut_Friendly?: string;
  checkOutFriendly?: string;
  totalAmount_HKD?: string;
  totalAmountHkd?: string;
}
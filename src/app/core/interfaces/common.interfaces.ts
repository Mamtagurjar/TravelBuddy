export interface BookingFormValue {
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
}

export interface TransactionDetails {
  bookingId: number;
  paymentId: string;
  orderId: string;
  amount: number;
}

export interface Booking {
  bookingId: number;
  hotelImage: string | null;
  hotelName: string;
  hotelLocation: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guests: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  transactionId: string;
}
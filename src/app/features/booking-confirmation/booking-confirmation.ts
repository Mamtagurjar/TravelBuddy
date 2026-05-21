import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.html',
  styleUrls: ['./booking-confirmation.scss'],
})
export class BookingConfirmationComponent implements OnInit {
  hotelName = 'The Grand Hotel';
  hotelLocation = 'New York, USA';
  roomType = 'Deluxe Suite';
  checkInDate = '2026-05-25';
  checkOutDate = '2026-05-30';
  numberOfGuests = 2;
  totalAmount = 15000;
  paymentStatus = 'Payment Successful';
  bookingId = 'BK123456789';
  transactionId = 'TX987654321';
  userName = 'John Doe';
  userEmail = 'john.doe@example.com';
  userPhone = '+1234567890';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  downloadInvoice(): void {
    console.log('Downloading invoice...');
  }

  viewBookings(): void {
    this.router.navigate(['/bookings']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}

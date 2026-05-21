import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HotelService } from '../../core/services/hotel.service';
import { switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, FormsModule],
  templateUrl: './hotel-details.html',
  styleUrl: './hotel-details.scss'
})
export class HotelDetailsComponent implements OnInit {
  hotel: any = null;
  isLoading = true;
  mapUrl: SafeResourceUrl | null = null;

  bookingState: 'overview' | 'bookingForm' | 'processing' | 'success' | 'failed' = 'overview';
  
  bookingForm = {
    guestName: 'John Doe',
    guestEmail: 'johndoe@example.com',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0
  };

  transactionDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.isLoading = true;
        this.cdr.markForCheck();
        return this.hotelService.getHotelById(params['id']);
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.hotel = response.data;
          this.updateMapUrl();
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load hotel details', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private updateMapUrl(): void {
    if (!this.hotel) return;
    const lat = this.hotel.latitude || 19.0896;
    const lng = this.hotel.longitude || 72.8656;
    const apiKey = environment.googleMapsApiKey;
    const rawUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  startBooking(): void {
    if (!this.hotel) return;
    this.bookingState = 'bookingForm';
  }

  proceedToPayment(): void {
    if (!this.hotel) return;
    this.bookingState = 'processing';
    
    // 1. Create booking and order on the backend
    this.http.post<any>('http://localhost:5000/api/payment/create-order', {
      hotel_id: this.hotel.id,
      room_id: 1, // Defaulting to 1 for demo purposes
      guest_name: this.bookingForm.guestName,
      guest_email: this.bookingForm.guestEmail,
      check_in_date: this.bookingForm.checkInDate,
      check_out_date: this.bookingForm.checkOutDate,
      adults: this.bookingForm.adults,
      children: this.bookingForm.children,
      amount: this.hotel.price_per_night
    }).subscribe({
      next: (response) => {
        if (response.success && response.order) {
          // 2. Open Razorpay Checkout Modal
          const options = {
            key: environment.razorpayKeyId || 'rzp_test_SrAzGjUm9tquXy',
            amount: response.order.amount,
            currency: 'INR',
            name: 'TravelBuddy',
            description: `Booking at ${this.hotel.name}`,
            image: '/assets/images/logo.png',
            order_id: response.order.id, 
            handler: (paymentResponse: any) => {
              // 3. Verify payment on the backend
              this.verifyPayment(paymentResponse, response.booking_id);
            },
            prefill: {
              name: this.bookingForm.guestName,
              email: this.bookingForm.guestEmail,
              contact: '9999999999'
            },
            theme: { color: '#0D9488' },
            modal: {
              ondismiss: () => {
                this.bookingState = 'bookingForm';
                this.cdr.detectChanges();
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          this.bookingState = 'failed';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to create order', err);
        this.bookingState = 'failed';
        this.cdr.detectChanges();
      }
    });
  }

  verifyPayment(paymentResponse: any, bookingId: number): void {
    this.bookingState = 'processing';
    this.cdr.detectChanges();

    this.http.post<any>('http://localhost:5000/api/payment/verify', paymentResponse)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.bookingState = 'success';
            this.transactionDetails = {
              bookingId: bookingId,
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              amount: this.hotel.price_per_night
            };
          } else {
            this.bookingState = 'failed';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to verify payment', err);
          this.bookingState = 'failed';
          this.cdr.detectChanges();
        }
      });
  }

  downloadInvoice(): void {
    if (!this.hotel || !this.transactionDetails) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups to download/print the invoice');
      return;
    }

    const htmlContent = `
      <html>
      <head>
        <title>Invoice - TravelBuddy</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 40px; line-height: 1.6; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; border-radius: 10px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0D9488; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #0D9488; text-decoration: none; }
          .title { font-size: 24px; font-weight: bold; color: #333; text-align: right; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .details-col h4 { margin: 0 0 8px 0; color: #666; font-size: 14px; text-transform: uppercase; }
          .details-col p { margin: 0 0 4px 0; font-size: 15px; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .details-table th { background: #f9fafb; text-align: left; padding: 12px; font-weight: 600; border-bottom: 2px solid #e5e7eb; color: #4b5563; }
          .details-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .total-section { display: flex; justify-content: flex-end; margin-top: 20px; font-size: 18px; }
          .total-box { border-top: 2px solid #0D9488; padding-top: 10px; width: 250px; text-align: right; }
          .total-box div { display: flex; justify-content: space-between; margin-bottom: 6px; }
          .grand-total { font-size: 20px; font-weight: bold; color: #0D9488; }
          .footer { text-align: center; margin-top: 50px; font-size: 14px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          @media print {
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div class="logo">TravelBuddy</div>
            <div class="title">INVOICE</div>
          </div>
          
          <div class="invoice-details">
            <div class="details-col">
              <h4>Billed To</h4>
              <p><strong>${this.bookingForm.guestName}</strong></p>
              <p>${this.bookingForm.guestEmail}</p>
            </div>
            <div class="details-col" style="text-align: right;">
              <h4>Booking Details</h4>
              <p><strong>Booking ID:</strong> #TB${this.transactionDetails.bookingId}</p>
              <p><strong>Transaction ID:</strong> ${this.transactionDetails.paymentId}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <table class="details-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Booking at ${this.hotel.name}</strong><br>
                  <span style="font-size: 13px; color: #666;">${this.hotel.address}, ${this.hotel.city}</span><br>
                  <span style="font-size: 13px; color: #666;">Guests: ${this.bookingForm.adults} Adults, ${this.bookingForm.children} Children</span>
                </td>
                <td>${this.bookingForm.checkInDate}</td>
                <td>${this.bookingForm.checkOutDate}</td>
                <td style="text-align: right;">₹${this.transactionDetails.amount}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div>
                <span>Room Charges:</span>
                <span>₹${this.transactionDetails.amount}</span>
              </div>
              <div>
                <span>Taxes & Fees:</span>
                <span>₹0.00</span>
              </div>
              <div class="grand-total" style="margin-top: 10px;">
                <span>Total Paid:</span>
                <span>₹${this.transactionDetails.amount}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing TravelBuddy!</p>
            <p>For any queries, contact support@travelbuddy.com</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}


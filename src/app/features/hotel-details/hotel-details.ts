import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HotelService } from '../../core/services/hotel.service';
import { BookingFormValue, TransactionDetails } from '../../core/interfaces/common.interfaces';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, FormsModule],
  templateUrl: './hotel-details.html',
  styleUrl: './hotel-details.scss'
})
export class HotelDetailsComponent implements OnInit {
  @ViewChild('invoiceTemplate') invoiceTemplate?: ElementRef<HTMLElement>;

  private readonly document = inject(DOCUMENT);
  private readonly bookingEmailStorageKey = 'travelBuddyGuestEmail';
  private readonly paymentsApiUrl = `${environment.apiUrl}/payment`;

  hotel: any = null;
  isLoading = true;
  mapUrl: SafeResourceUrl | null = null;
  bookingState: 'overview' | 'bookingForm' | 'processing' | 'success' | 'failed' = 'overview';

  bookingForm: BookingFormValue = {
    guestName: 'John Doe',
    guestEmail: 'johndoe@example.com',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0
  };

  transactionDetails: TransactionDetails | null = null;

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

  get bookingAmount(): number {
    const selectedRoom = this.getSelectedRoom();
    return Number(selectedRoom?.price ?? this.hotel?.price_per_night ?? 0);
  }

  get normalizedGuestEmail(): string {
    return this.bookingForm.guestEmail.trim().toLowerCase();
  }

  get guestSummary(): string {
    const adultLabel = `${this.bookingForm.adults} ${this.bookingForm.adults === 1 ? 'Adult' : 'Adults'}`;
    const childLabel = this.bookingForm.children > 0
      ? `, ${this.bookingForm.children} ${this.bookingForm.children === 1 ? 'Child' : 'Children'}`
      : '';
    return `${adultLabel}${childLabel}`;
  }

  startBooking(): void {
    if (!this.hotel) return;
    this.bookingState = 'bookingForm';
  }

  proceedToPayment(bookingDetailsForm: NgForm): void {
    if (bookingDetailsForm.invalid || !this.hotel) {
      bookingDetailsForm.control.markAllAsTouched();
      return;
    }

    const selectedRoom = this.getSelectedRoom();

    if (this.normalizedGuestEmail) {
      window.localStorage.setItem(this.bookingEmailStorageKey, this.normalizedGuestEmail);
    }

    this.bookingState = 'processing';

    this.http.post<any>(`${this.paymentsApiUrl}/create-order`, this.buildPaymentPayload(selectedRoom)).subscribe({
      next: (response) => {
        if (response.success && response.order) {
          if (response.mock) {
            this.bookingState = 'success';
            this.transactionDetails = {
              bookingId: response.booking_id,
              paymentId: response.order.id,
              orderId: response.order.id,
              amount: (response.order.amount || 0) / 100
            };
            this.cdr.detectChanges();
            return;
          }

          const options = {
            key: environment.razorpayKeyId || 'rzp_test_SrAzGjUm9tquXy',
            amount: response.order.amount,
            currency: 'INR',
            name: 'TravelBuddy',
            description: `Booking at ${this.hotel.name}`,
            image: '/assets/images/logo.png',
            order_id: response.order.id,
            handler: (paymentResponse: any) => {
              this.verifyPayment(paymentResponse, response.booking_id);
            },
            prefill: {
              name: this.bookingForm.guestName.trim(),
              email: this.normalizedGuestEmail,
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

    this.http.post<any>(`${this.paymentsApiUrl}/verify`, paymentResponse)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.bookingState = 'success';
            this.transactionDetails = {
              bookingId,
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              amount: this.bookingAmount
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

    const invoiceMarkup = this.invoiceTemplate?.nativeElement.outerHTML;
    if (!invoiceMarkup) {
      printWindow.close();
      return;
    }

    const headMarkup = Array.from(this.document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join('\n');

    const htmlContent = `
      <html>
        <head>
          <title>Invoice - TravelBuddy</title>
          ${headMarkup}
        </head>
        <body>
          ${invoiceMarkup}
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

  private updateMapUrl(): void {
    if (!this.hotel) return;
    const lat = this.hotel.latitude || 19.0896;
    const lng = this.hotel.longitude || 72.8656;
    const apiKey = environment.googleMapsApiKey;
    const rawUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  private getSelectedRoom(): any | null {
    if (!this.hotel?.rooms?.length) {
      return null;
    }

    return this.hotel.rooms.find((room: any) => Number(room.price) === Number(this.hotel.price_per_night))
      || this.hotel.rooms[0];
  }

  private buildPaymentPayload(selectedRoom: any | null) {
    return {
      hotel_id: this.hotel.id,
      room_id: selectedRoom?.id,
      guest_name: this.bookingForm.guestName.trim(),
      guest_email: this.normalizedGuestEmail,
      check_in_date: this.bookingForm.checkInDate,
      check_out_date: this.bookingForm.checkOutDate,
      adults: this.bookingForm.adults,
      children: this.bookingForm.children,
      amount: selectedRoom?.price || this.hotel.price_per_night
    };
  }
}

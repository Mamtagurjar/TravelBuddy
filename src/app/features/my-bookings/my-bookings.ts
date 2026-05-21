import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking } from '../../core/interfaces/common.interfaces';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.scss'],
})
export class MyBookingsComponent implements OnInit {
  private readonly bookingEmailStorageKey = 'travelBuddyGuestEmail';
  private readonly bookingsApiUrl = `${environment.apiUrl}/bookings`;
  bookings: Booking[] = [];
  isLoading = true;
  errorMessage = '';
  guestEmail = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const emailFromQuery = String(params.get('email') || '').trim().toLowerCase();
      const emailFromStorage = String(window.localStorage.getItem(this.bookingEmailStorageKey) || '').trim().toLowerCase();

      this.guestEmail = emailFromQuery || emailFromStorage;

      if (!this.guestEmail) {
        this.bookings = [];
        this.isLoading = false;
        this.errorMessage = 'Complete a booking with your email to see it here.';
        this.cdr.detectChanges();
        return;
      }

      window.localStorage.setItem(this.bookingEmailStorageKey, this.guestEmail);
      this.loadBookings();
    });
  }

  goBack(): void {
    this.location.back();
  }

  retryLoadBookings(): void {
    if (!this.guestEmail) {
      return;
    }

    this.loadBookings();
  }

  private loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bookings = [];
    this.cdr.detectChanges();

    const params = new HttpParams().set('email', this.guestEmail);

    this.http.get<{ success: boolean; data: Booking[]; message?: string }>(this.bookingsApiUrl, { params })
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.bookings = response.success ? response.data : [];
          if (!response.success) {
            this.errorMessage = response.message || 'Unable to load bookings right now.';
          }
        },
        error: (error) => {
          console.error('Failed to load bookings', error);
          this.bookings = [];
          this.errorMessage = 'Unable to load bookings right now. Please try again.';
        }
      });
  }

  getGuestLabel(booking: Booking): string {
    const adultLabel = `${booking.adults} ${booking.adults === 1 ? 'adult' : 'adults'}`;
    const childLabel = booking.children > 0 ? `, ${booking.children} ${booking.children === 1 ? 'child' : 'children'}` : '';
    return `${adultLabel}${childLabel}`;
  }

  // viewDetails(bookingId: number): void {
  //   console.log(`Viewing details for booking ID: ${bookingId}`);
  // }

  downloadInvoice(bookingId: number): void {
    console.log(`Downloading invoice for booking ID: ${bookingId}`);
  }

  cancelBooking(bookingId: number): void {
    console.log(`Cancelling booking ID: ${bookingId}`);
  }
}

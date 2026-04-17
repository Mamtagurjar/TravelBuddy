import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HotelService } from '../../core/services/hotel.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './hotel-details.html',
  styleUrl: './hotel-details.scss'
})
export class HotelDetailsComponent implements OnInit {
  hotel: any = null;
  isLoading = true;
  mapUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
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

  bookHotel(): void {
    if (!this.hotel) return;
    alert(`Thank you for choosing ${this.hotel.name}! Your reservation has been initiated.`);
  }
}


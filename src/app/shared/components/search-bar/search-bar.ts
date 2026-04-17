import { Component, signal, inject, computed, HostListener, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDatepickerModule, DateRange } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule, 
    MatIconModule, 
    CommonModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBarComponent implements OnInit {
  private router = inject(Router);

  @Input() initialDestination = '';
  @Input() initialCheckIn: string | null = null;
  @Input() initialCheckOut: string | null = null;
  @Input() initialAdults = 2;
  @Input() initialChildren = 0;
  @Input() initialRooms = 1;

  ngOnInit() {
    if (this.initialDestination) this.destination.set(this.initialDestination);
    if (this.initialCheckIn) this.checkIn.set(new Date(this.initialCheckIn));
    if (this.initialCheckOut) this.checkOut.set(new Date(this.initialCheckOut));
    this.adults.set(this.initialAdults);
    this.children.set(this.initialChildren);
    this.rooms.set(this.initialRooms);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.showDestDropdown.set(false);
    this.showGuestDropdown.set(false);
    this.showDateDropdown.set(false);
  }
  
  toggleDest(event: Event): void {
    event.stopPropagation();
    this.showDestDropdown.update(v => !v);
    this.showGuestDropdown.set(false);
    this.showDateDropdown.set(false);
  }

  toggleGuests(event: Event): void {
    event.stopPropagation();
    this.showGuestDropdown.update(v => !v);
    this.showDestDropdown.set(false);
    this.showDateDropdown.set(false);
  }

  toggleDates(event: Event): void {
    event.stopPropagation();
    this.showDateDropdown.update(v => !v);
    this.showDestDropdown.set(false);
    this.showGuestDropdown.set(false);
  }

  clearDest(event: Event): void {
    event.stopPropagation();
    this.destination.set('');
  }

  closeGuestDropdown(): void {
    this.showGuestDropdown.set(false);
  }

  /** Form state */
  minDate = new Date(new Date().setHours(0,0,0,0));
  destination = signal('');
  
  // Initialize with tomorrow for check-in and day-after for check-out
  checkIn = signal<Date | null>(this.getTomorrow());
  checkOut = signal<Date | null>(this.getDayAfterTomorrow());

  /** Date Dropdown State */
  selectedDateRange = computed(() => new DateRange(this.checkIn(), this.checkOut()));

  /** Date Dropdown State */
  activeDateTab = signal<'calendar' | 'flexible'>('calendar');
  calendarStart = new Date();
  calendarNext = new Date(new Date().setMonth(new Date().getMonth() + 1));

  private getTomorrow(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getDayAfterTomorrow(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  
  // Guest details
  adults = signal(2);
  children = signal(0);
  rooms = signal(1);
  addFlights = signal(false);
  travelingWithPets = signal(false);

  // Recent & Trending
  recentSearches = [
    { city: 'Mumbai', country: 'India', dates: 'Apr 16 - Apr 17', guests: '2 adults' }
  ];

  trendingDestinations = [
    { city: 'Mumbai', country: 'India' },
    { city: 'Pune', country: 'India' },
    { city: 'New Delhi', country: 'India' },
    { city: 'Bangalore', country: 'India' },
    { city: 'Tokyo', country: 'Japan' }
  ];

  // Dropdown visibility
  showDestDropdown = signal(false);
  showGuestDropdown = signal(false);
  showDateDropdown = signal(false);

  // Date selection logic
  onDateChange(date: Date | null): void {
    if (!this.checkIn() || (this.checkIn() && this.checkOut())) {
      this.checkIn.set(date);
      this.checkOut.set(null);
    } else {
      if (date && date < this.checkIn()!) {
        this.checkIn.set(date);
        this.checkOut.set(null);
      } else {
        this.checkOut.set(date);
        this.showDateDropdown.set(false); // Close after range selected
      }
    }
  }

  getFormattedRange(): string {
    const cIn = this.checkIn();
    const cOut = this.checkOut();
    if (!cIn) return 'Select dates';
    
    const formatDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    if (!cOut) return `${formatDate(cIn)} — ...`;
    return `${formatDate(cIn)} — ${formatDate(cOut)}`;
  }

  // Computed summary
  guests = computed(() => {
    const a = this.adults();
    const c = this.children();
    const r = this.rooms();
    
    const adultStr = `${a} ${a === 1 ? 'adult' : 'adults'}`;
    const childStr = c > 0 ? ` · ${c} ${c === 1 ? 'child' : 'children'}` : '';
    const roomStr = ` · ${r} ${r === 1 ? 'room' : 'rooms'}`;
    
    return `${adultStr}${childStr}${roomStr}`;
  });

  // Mock list of states/cities
  states = [
    'Mumbai, Maharashtra, India',
    'Chhatrapati Shivaji International Airport Mumbai, India',
    'Mumbai Central, Mumbai, India',
    'The Taj Mahal Palace, Mumbai, India',
    'Navi Mumbai, Maharashtra, India',
    'New Delhi, Delhi, India',
    'Bangalore, Karnataka, India',
    'Goa, India',
    'Rajasthan, India (Jaipur, Jodhpur)',
    'Kerala, India (Kochi, Munnar)',
  ];

  indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  filteredStates = computed(() => {
    const dest = this.destination().toLowerCase();
    if (!dest) return this.indianStates;
    return this.indianStates.filter(s => s.toLowerCase().includes(dest));
  });

  filteredLocations = computed(() => {
    const dest = this.destination().toLowerCase();
    if (!dest) return this.states;
    return this.states.filter(s => s.toLowerCase().includes(dest));
  });

  // Guest increment/decrement
  updateCount(type: 'adults' | 'children' | 'rooms', amount: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (type === 'adults') {
      this.adults.update(v => Math.max(1, v + amount));
    } else if (type === 'children') {
      this.children.update(v => Math.max(0, v + amount));
    } else if (type === 'rooms') {
      this.rooms.update(v => Math.max(1, v + amount));
    }
  }

  selectDest(state: string): void {
    // Only take the city name part for the search (e.g., "Delhi" from "Delhi, India")
    const cityName = state.split(',')[0].trim();
    this.destination.set(cityName);
    this.showDestDropdown.set(false);
  }

  /** Called when user clicks Search */
  onSearch(): void {
    const formatLocalDate = (date: any) => {
      if (!date || !(date instanceof Date)) return undefined;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const queryParams: any = {
      city: this.destination(),
      adults: this.adults(),
      children: this.children(),
      rooms: this.rooms()
    };

    const cIn = formatLocalDate(this.checkIn());
    const cOut = formatLocalDate(this.checkOut());
    
    if (cIn) queryParams.check_in = cIn;
    if (cOut) queryParams.check_out = cOut;

    this.router.navigate(['/search'], { 
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, switchMap, tap, debounceTime } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { Hotel, FilterOptions, FilterOption, SearchFilters } from '../../core/models/hotel.model';
import { MatSliderModule } from '@angular/material/slider';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';

@Component({
  selector: 'app-hotel-search',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent, MatSliderModule],
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelSearchComponent implements OnInit {
  hotels: Hotel[] = [];
  filters: FilterOptions | null = null;
  isLoading = true;

  // Cache tracker
  currentCity = '';

  // Pagination State
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  pageSize = 10;

  // Current search params
  searchParams: SearchFilters = {};

  get starRatings(): FilterOption[] {
    const defaultStars = [5, 4, 3, 2, 1];
    return defaultStars.map(star => {
      const found = this.filters?.star_ratings?.find((s: any) => parseInt(s.value as any) === star);
      return {
        value: star,
        count: found ? found.count : 0
      };
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Optimized: Observable pipeline to handle searches, cancellation, and duplicate prevention
    this.route.queryParams.pipe(
      debounceTime(300), // Prevent multiple fast rapid calls
      // Robust stringification safely ignores parameter order and handles arrays
      distinctUntilChanged((prev, curr) => {
        const serialize = (obj: any) => {
          if (!obj) return '';
          return Object.keys(obj)
            .sort()
            .map(k => `${k}=${Array.isArray(obj[k]) ? obj[k].slice().sort().join(',') : obj[k]}`)
            .join('&');
        };
        return serialize(prev) === serialize(curr);
      }),
      tap(params => {
        this.searchParams = params;
        this.isLoading = true;
        this.cdr.markForCheck();
      }),
      switchMap(params => this.hotelService.searchHotels(params))
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.hotels = response.data.hotels;

          // Only update filters if the city has changed
          const newCity = this.searchParams.city || '';
          if (newCity !== this.currentCity || !this.filters) {
            this.filters = response.data.filters;
            console.log(this.filters);
            this.currentCity = newCity;
          }

          // Update Pagination State  
          this.currentPage = response.data.pagination.page;
          this.totalPages = response.data.pagination.totalPages;
          this.totalResults = response.data.pagination.total;
          this.pageSize = response.data.pagination.limit;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Search failed', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge'
    });

    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Updates the URL parameters when a filter is toggled
   */
  toggleFilter(key: keyof SearchFilters, value: any): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    let values = currentParams[key];

    // Ensure values is an array safely
    if (!values) {
      values = [];
    } else if (!Array.isArray(values)) {
      values = [values];
    } else {
      values = [...values];
    }

    const valueStr = value.toString();
    if (values.includes(valueStr)) {
      values = values.filter((v: any) => v !== valueStr);
    } else {
      values.push(valueStr);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: values.length ? values : null },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Clears all active filters
   */
  clearFilters(): void {
    const currentCity = this.route.snapshot.queryParams['city'];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { city: currentCity }, // Keep the city, clear the rest
    });
  }

  /**
   * Sets a specific filter value (overwrites any existing value)
   */
  setFilter(key: keyof SearchFilters, value: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value || null },
      queryParamsHandling: 'merge'
    });
  }

  isFilterSelected(key: keyof SearchFilters, value: any): boolean {
    const values = this.route.snapshot.queryParams[key];
    if (!values) return false;
    if (Array.isArray(values)) return values.includes(value.toString());
    return values === value.toString();
  }
}

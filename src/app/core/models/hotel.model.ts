import { ApiResponse } from './api-response.model';

/**
 * Core Hotel Interface
 * Matches the structure returned by the PostgreSQL Database
 */
export interface Hotel {
  id: string;
  name: string;
  description: string;
  city: string;
  state?: string;
  address: string;
  star_rating: number;
  user_rating: number;
  review_count: number;
  price_per_night: number;
  amenities: string[];
  main_image: string;
  property_type: string;
  meal_plan?: string;
  free_cancellation: boolean;
  no_credit_card_needed: boolean;
}

/**
 * Filter Parameters
 * Used for binding to the Search Sidebar and URL Query Params
 */
export interface SearchFilters {
  city?: string;
  state?: string;
  check_in?: string;
  check_out?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  min_price?: number;
  max_price?: number;
  star_rating?: number[];
  amenities?: string[];
  property_type?: string[];
  meal_plan?: string[];
  free_cancellation?: boolean;
  no_credit_card?: boolean;
  sort_by?: 'price_low' | 'price_high' | 'rating' | 'popularity';
  bed_type?: string[];
  page?: number;
  limit?: number;
}

/**
 * Dynamic Filter Statistics
 * Data used to render the 30% sidebar with counts
 */
export interface FilterOption {
  value: string | number;
  label?: string;
  count: number;
}

export interface FilterOptions {
  star_ratings: FilterOption[];
  amenities: FilterOption[];
  meal_plans: FilterOption[];
  bed_types: FilterOption[];
  property_types: FilterOption[];
  price_range: {
    min: string | number;
    max: string | number;
  };
}

/**
 * Complete Search Response
 */
export interface SearchResponseData {
  hotels: Hotel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: FilterOptions;
}

export interface HotelSearchResponse {
  success: boolean;
  data: SearchResponseData;
}

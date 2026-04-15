// ============================================
// Trip Interfaces
// ============================================

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  budget?: number;
  currency?: string;
  status: TripStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TripStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';

export interface TripFilters {
  status?: TripStatus;
  destination?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

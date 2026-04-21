import { environment } from '../../../environments/environment';

// ============================================
// API Constants
// ============================================

export const API_BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },

  // Trips
  TRIPS: {
    LIST: `${API_BASE_URL}/trips`,
    DETAILS: (id: string) => `${API_BASE_URL}/trips/${id}`,
    CREATE: `${API_BASE_URL}/trips`,
    UPDATE: (id: string) => `${API_BASE_URL}/trips/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/trips/${id}`,
  },

  // User Profile
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE: `${API_BASE_URL}/users/profile`,
  },
} as const;

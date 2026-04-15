// ============================================
// App-wide Constants
// ============================================

export const APP_NAME = 'TravelBuddy';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN:    'tb_auth_token',
  REFRESH_TOKEN: 'tb_refresh_token',
  USER_PROFILE:  'tb_user_profile',
  THEME:         'tb_theme',
} as const;

export const DATE_FORMATS = {
  DISPLAY:  'dd MMM yyyy',
  API:      'yyyy-MM-dd',
  DATETIME: 'dd MMM yyyy, hh:mm a',
} as const;

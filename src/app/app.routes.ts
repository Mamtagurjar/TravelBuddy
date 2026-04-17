import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
  // Main App Routes (with Header/Footer)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'flights',
        loadComponent: () => import('./shared/components/feature-placeholder/feature-placeholder').then(m => m.FeaturePlaceholderComponent)
      },
      {
        path: 'packages',
        loadComponent: () => import('./shared/components/feature-placeholder/feature-placeholder').then(m => m.FeaturePlaceholderComponent)
      },
      {
        path: 'car-rental',
        loadComponent: () => import('./shared/components/feature-placeholder/feature-placeholder').then(m => m.FeaturePlaceholderComponent)
      },
      {
        path: 'attractions',
        loadComponent: () => import('./shared/components/feature-placeholder/feature-placeholder').then(m => m.FeaturePlaceholderComponent)
      },
      {
        path: 'taxis',
        loadComponent: () => import('./shared/components/feature-placeholder/feature-placeholder').then(m => m.FeaturePlaceholderComponent)
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/hotel-search/hotel-search.component').then(
            (m) => m.HotelSearchComponent
          ),
      },
      {
        path: 'hotel/:id',
        loadComponent: () =>
          import('./features/hotel-details/hotel-details').then(
            (m) => m.HotelDetailsComponent
          ),
      },
    ],
  },

  // Auth Routes (Minimalist Layout)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { homeEntryGuard } from './core/guards/home-entry-guard';

import { CustomerLayout } from './layout/public/customer-layout/customer-layout';

export const routes: Routes = [

  // ============================================================
  // PUBLIC / CUSTOMER APPLICATION
  // ============================================================

  {
    path: '',
    component: CustomerLayout,
    

    children: [

      // Home
      {
        path: '',
        pathMatch: 'full',
       // canActivate: [homeEntryGuard],
        loadComponent: () =>
          import('./features/home/home')
            .then(m => m.Home)
      },

      // About Us
      {
        path: 'about-us',
        loadComponent: () =>
          import('./features/about-us/about-us')
            .then(m => m.AboutUs)
      },

      // Cars
      {
        path: 'cars',
        loadComponent: () =>
          import('./features/cars/cars')
            .then(m => m.Cars)
      },

      // Car Details
      {
        path: 'cars/:id',
        loadComponent: () =>
          import('./features/cars/car-details/car-details')
            .then(m => m.CarDetails)
      },

      // Booking
      {
        path: 'booking',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/booking/booking')
            .then(m => m.Booking)
      },

      // FAQ
      {
        path: 'faq',
        loadComponent: () =>
          import('./features/faq/faq')
            .then(m => m.Faq)
      },

      // Contact
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact')
            .then(m => m.Contact)
      },

      // Services
      {
        path: 'services',
        loadComponent: () =>
          import('./features/company-services/services')
            .then(m => m.Services)
      },

      // My Bookings
      {
        path: 'my-bookings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/booking/my-bookings/my-bookings')
            .then(m => m.MyBookings)
      }
    ]
  },

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login')
        .then(m => m.LoginComponent)
  },

  // ============================================================
  // ADMIN
  // ============================================================

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  },

  // ============================================================
  // NOT FOUND
  // ============================================================

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found')
        .then(m => m.NotFound)
  }
];
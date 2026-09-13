import { Routes } from '@angular/router';

import { authGuard } from '../core/guards/auth-guard';
import { roleGuard } from '../core/guards/role-guard';
import { UserRole } from '../core/models/user.model';

import { AdminLayout } from './layout/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,

    canActivate: [authGuard, roleGuard],

    data: {
      roles: [
        UserRole.Manager,
        UserRole.Employee
      ]
    },

    children: [

      // ============================================================
      // DEFAULT
      // ============================================================

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },

      // ============================================================
      // DASHBOARD
      // ============================================================

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard)
      },

      // ============================================================
      // BOOKINGS
      // ============================================================

      {
        path: 'bookings',
        loadComponent: () =>
          import('./pages/bookings/bookings')
            .then(m => m.Bookings)
      },

      {
        path: 'bookings/:id',
        loadComponent: () =>
          import(
            './pages/bookings/booking-details.component/booking-details.component'
          ).then(m => m.BookingDetailsComponent)
      },

      // ============================================================
      // CATEGORIES
      // ============================================================

      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories')
            .then(m => m.Categories)
      },

      {
        path: 'categories/create',
        loadComponent: () =>
          import(
            './pages/categories/create-category/create-category'
          ).then(m => m.CreateCategory)
      },

      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import(
            './pages/categories/edit-category/edit-category'
          ).then(m => m.EditCategory)
      },

      // ============================================================
      // CARS
      // ============================================================

      {
        path: 'cars',
        loadComponent: () =>
          import('./pages/cars/cars')
            .then(m => m.Cars)
      },

      {
        path: 'cars/create',
        loadComponent: () =>
          import(
            './pages/cars/create-car.component/create-car.component'
          ).then(m => m.CreateCarComponent)
      },

      {
        path: 'cars/edit/:id',
        loadComponent: () =>
          import(
            './pages/cars/edit-car.component/edit-car.component'
          ).then(m => m.EditCarComponent)
      },

      // ============================================================
      // USERS — MANAGER ONLY
      // ============================================================

      {
        path: 'users',
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.Manager]
        },
        loadComponent: () =>
          import('./pages/users/users')
            .then(m => m.Users)
      },

      {
        path: 'users/:id',
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.Manager]
        },
        loadComponent: () =>
          import(
            './pages/users/user-details/user-details.component'
          ).then(m => m.UserDetailsComponent)
      }
    ]
  }
];
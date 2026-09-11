import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

import { AboutUs } from './features/about-us/about-us';
import { Booking } from './features/booking/booking';
import { CarDetails } from './features/cars/car-details/car-details';
import { Cars } from './features/cars/cars';
import { Services } from './features/company-services/services';
import { Contact } from './features/contact/contact';
import { Faq } from './features/faq/faq';
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';

import { CustomerLayout } from './layout/public/customer-layout/customer-layout';
import { homeEntryGuard } from './core/guards/home-entry-guard';

export const routes: Routes = [

  // =========================
  // CUSTOMER
  // =========================

  {
    path: '',
    component: CustomerLayout,
    canActivate: [homeEntryGuard],

    children: [

      {
        path: '',
        component: Home
      },

      {
        path: 'about-us',
        component: AboutUs
      },

      {
        path: 'cars',
        component: Cars
      },

      {
        path: 'cars/:id',
        component: CarDetails
      },

      {
        path: 'booking',
        component: Booking
      },

      {
        path: 'faq',
        component: Faq
      },

      {
        path: 'contact',
        component: Contact
      },

      {
        path: 'services',
        component: Services,
        canActivate: [authGuard]
      }

    ]
  },

  // =========================
  // LOGIN
  // =========================

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login')
        .then(m => m.LoginComponent)
  },

  // =========================
  // ADMIN
  // =========================

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  },

  // =========================
  // NOT FOUND
  // =========================

  {
    path: '**',
    component: NotFound
  }

];
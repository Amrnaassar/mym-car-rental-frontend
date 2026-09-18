import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
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
        data: {
          seo: {
            title: 'SEO.HOME.TITLE',
            description: 'SEO.HOME.DESCRIPTION',
            keywords: 'SEO.HOME.KEYWORDS'
          }
        },
        loadComponent: () =>
          import('./features/home/home')
            .then(m => m.Home)
      },

      // About Us
      {
        path: 'about-us',
        data: {
          seo: {
            title: 'SEO.ABOUT.TITLE',
            description: 'SEO.ABOUT.DESCRIPTION',
            keywords: 'SEO.ABOUT.KEYWORDS'
          }
        },
        loadComponent: () =>
          import('./features/about-us/about-us')
            .then(m => m.AboutUs)
      },

      // Cars
      {
        path: 'cars',
        data: {
          seo: {
            title: 'SEO.CARS.TITLE',
            description: 'SEO.CARS.DESCRIPTION',
            keywords: 'SEO.CARS.KEYWORDS'
          }
        },
        loadComponent: () =>
          import('./features/cars/cars')
            .then(m => m.Cars)
      },

      // Car Details
      {
        path: 'cars/:id',
        data: {
          seo: {
            dynamic: true,
            type: 'product'
          }
        },
        loadComponent: () =>
          import('./features/cars/car-details/car-details')
            .then(m => m.CarDetails)
      },

      // Booking
      {
        path: 'booking',
        canActivate: [authGuard],
        data: {
          seo: {
            title: 'SEO.BOOKING.TITLE',
            description: 'SEO.BOOKING.DESCRIPTION',
            robots: 'noindex, nofollow'
          }
        },
        loadComponent: () =>
          import('./features/booking/booking')
            .then(m => m.Booking)
      },

      // FAQ
      {
        path: 'faq',
        data: {
          seo: {
            title: 'SEO.FAQ.TITLE',
            description: 'SEO.FAQ.DESCRIPTION',
            keywords: 'SEO.FAQ.KEYWORDS'
          }
        },
        loadComponent: () =>
          import('./features/faq/faq')
            .then(m => m.Faq)
      },

      // Contact
      {
        path: 'contact',
        data: {
          seo: {
            title: 'SEO.CONTACT.TITLE',
            description: 'SEO.CONTACT.DESCRIPTION',
            keywords: 'SEO.CONTACT.KEYWORDS'
          }
        },
        loadComponent: () =>
          import('./features/contact/contact')
            .then(m => m.Contact)
      },

      // Services
      {
        path: 'services',
        data: {
          seo: {
            title: 'SEO.SERVICES.TITLE',
            description: 'SEO.SERVICES.DESCRIPTION',
            keywords: 'SEO.SERVICES.KEYWORDS'
          }
        },
        loadComponent: () =>
          import('./features/company-services/services')
            .then(m => m.Services)
      },

      // My Bookings
      {
        path: 'my-bookings',
        canActivate: [authGuard],
        data: {
          seo: {
            title: 'SEO.MY_BOOKINGS.TITLE',
            description: 'SEO.MY_BOOKINGS.DESCRIPTION',
            robots: 'noindex, nofollow'
          }
        },
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
    data: {
      seo: {
        title: 'SEO.LOGIN.TITLE',
        description: 'SEO.LOGIN.DESCRIPTION',
        robots: 'noindex, nofollow'
      }
    },
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
    data: {
      seo: {
        title: 'SEO.NOT_FOUND.TITLE',
        description: 'SEO.NOT_FOUND.DESCRIPTION',
        robots: 'noindex, nofollow'
      }
    },
    loadComponent: () =>
      import('./features/not-found/not-found')
        .then(m => m.NotFound)
  }
];
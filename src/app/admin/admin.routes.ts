import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { UserRole } from '../core/models/user.model';

import { roleGuard } from '../core/guards/role-guard';
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
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },

            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard')
                        .then(m => m.Dashboard)
            },

            {
                path: 'bookings',
                loadComponent: () =>
                    import('./pages/bookings/bookings')
                        .then(m => m.Bookings),

                canActivate: [roleGuard],

                data: {
                    roles: [
                        UserRole.Employee,
                        UserRole.Manager
                    ]
                }
            },

            {
                path: 'bookings/:id',
                loadComponent: () =>
                    import('./pages/bookings/booking-details.component/booking-details.component')
                        .then(m => m.BookingDetailsComponent),

                canActivate: [roleGuard],

                data: {
                    roles: [
                        UserRole.Employee,
                        UserRole.Manager
                    ]
                }
            },

            {
                path: 'cars',
                loadComponent: () =>
                    import('./pages/cars/cars')
                        .then(m => m.Cars)
            },

            {
                path: 'categories',
                loadComponent: () =>
                    import('./pages/categories/categories')
                        .then(m => m.Categories)
            },
            {
                path: 'categories/create',
                loadComponent: () =>
                    import('./pages/categories/create-category/create-category')
                        .then(m => m.CreateCategory)
            },
            {
                path: 'categories/edit/:id',
                loadComponent: () =>
                    import('./pages/categories/edit-category/edit-category')
                        .then(m => m.EditCategory)
            },
            {
                path: 'cars',
                loadComponent: () =>
                    import('./pages/cars/cars')
                        .then(m => m.Cars)
            },

            {
                path: 'cars/create',
                loadComponent: () =>
                    import('./pages/cars/create-car.component/create-car.component')
                        .then(m => m.CreateCarComponent)
            },

            {
                path: 'cars/edit/:id',
                loadComponent: () =>
                    import('./pages/cars/edit-car.component/edit-car.component')
                        .then(m => m.EditCarComponent)
            },

            {
                path: 'users',
                loadComponent: () =>
                    import('./pages/users/users')
                        .then(m => m.Users),
                canActivate: [roleGuard],
                data: {
                    roles: [UserRole.Manager]
                }
            },

            {
                path: 'users/:id',
                loadComponent: () =>
                    import('./pages/users/user-details/user-details.component')
                        .then(m => m.UserDetailsComponent),
                canActivate: [roleGuard],
                data: {
                    roles: [UserRole.Manager]
                }
            },
        ]
    }
];
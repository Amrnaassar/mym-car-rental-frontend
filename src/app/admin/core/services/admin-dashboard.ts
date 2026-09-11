import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';

import { Car } from '../../../core/models/car.model';
import {
  BookingResponse,
  BookingStatus
} from '../../../core/models/booking.model';
import {
  Category
} from '../../../core/models/car-category.model';
import {
  User
} from '../../../core/models/user.model';
import { AdminBookingsService } from './admin-bookings';
import { AdminCarsService } from './admin-cars';
import { AdminCategoriesService } from './admin-categories';
import { AdminUsersService } from './admin-users';


export interface AdminDashboardData {
  cars: Car[];
  bookings: BookingResponse[];
  categories: Category[];
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private readonly carsService =
    inject(AdminCarsService);

  private readonly bookingsService =
    inject(AdminBookingsService);

  private readonly categoriesService =
    inject(AdminCategoriesService);

  private readonly usersService =
    inject(AdminUsersService);

  loadDashboard(
    includeUsers: boolean
  ): Observable<AdminDashboardData> {
    return forkJoin({
      cars: this.carsService.getAll(),
      bookings: this.bookingsService.getAll(),
      categories: this.categoriesService.getAll(),

      users: includeUsers
        ? this.usersService.getAll()
        : of([])
    });
  }

  static calculateRevenue(
    bookings: BookingResponse[]
  ): number {
    return bookings
      .filter(
        booking =>
          booking.status !== BookingStatus.Cancelled
      )
      .reduce(
        (total, booking) =>
          total + Number(booking.grandTotal),
        0
      );
  }
}
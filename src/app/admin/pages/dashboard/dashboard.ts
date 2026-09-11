import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  BookingResponse,
  BookingStatus,
  BookingRentalPlan
} from '../../../core/models/booking.model';

import {
  UserRole
} from '../../../core/models/user.model';

import {
  AdminDashboardService,
  AdminDashboardData
} from '../../core/services/admin-dashboard';
import {
  AuthService
} from '../../../core/services/auth.service';
import { StatCardComponent } from '../../shared/components/stat-card.component/stat-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly dashboardService =
    inject(AdminDashboardService);

  private readonly authService =
    inject(AuthService);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal<string | null>(null);

  readonly data =
    signal<AdminDashboardData | null>(null);

  readonly currentUser =
    this.authService.currentUser;

  readonly isManager = computed(
    () =>
      this.currentUser()?.role ===
      UserRole.Manager
  );

  readonly totalCars = computed(
    () =>
      this.data()?.cars.length ?? 0
  );

  readonly activeCars = computed(
    () =>
      this.data()?.cars.filter(
        car => car.isActive
      ).length ?? 0
  );

  readonly inactiveCars = computed(
    () =>
      this.data()?.cars.filter(
        car => !car.isActive
      ).length ?? 0
  );

  readonly totalBookings = computed(
    () =>
      this.data()?.bookings.length ?? 0
  );

  readonly pendingBookings = computed(
    () =>
      this.data()?.bookings.filter(
        booking =>
          booking.status ===
          BookingStatus.Pending
      ).length ?? 0
  );

  readonly confirmedBookings = computed(
    () =>
      this.data()?.bookings.filter(
        booking =>
          booking.status ===
          BookingStatus.Confirmed
      ).length ?? 0
  );

  readonly completedBookings = computed(
    () =>
      this.data()?.bookings.filter(
        booking =>
          booking.status ===
          BookingStatus.Completed
      ).length ?? 0
  );

  readonly cancelledBookings = computed(
    () =>
      this.data()?.bookings.filter(
        booking =>
          booking.status ===
          BookingStatus.Cancelled
      ).length ?? 0
  );

  readonly totalCategories = computed(
    () =>
      this.data()?.categories.length ?? 0
  );

  readonly totalUsers = computed(
    () =>
      this.data()?.users.length ?? 0
  );

  readonly totalRevenue = computed(() => {
    const bookings =
      this.data()?.bookings ?? [];

    return AdminDashboardService.calculateRevenue(
      bookings
    );
  });

  readonly recentBookings =
    computed(() => {
      const bookings =
        this.data()?.bookings ?? [];

      return bookings.slice(0, 5);
    });

  readonly featuredCars = computed(
    () =>
      this.data()?.cars.filter(
        car => car.isFeatured
      ).length ?? 0
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.dashboardService
      .loadDashboard(
        this.isManager()
      )
      .subscribe({
        next: data => {
          this.data.set(data);
          this.loading.set(false);
        },

        error: () => {
          this.loading.set(false);

          this.errorMessage.set(
            'Unable to load dashboard data.'
          );
        }
      });
  }

  statusLabel(
    status: BookingStatus
  ): string {
    switch (status) {
      case BookingStatus.Confirmed:
        return 'Confirmed';

      case BookingStatus.Cancelled:
        return 'Cancelled';

      case BookingStatus.Completed:
        return 'Completed';

      default:
        return 'Pending';
    }
  }

  statusClass(
    status: BookingStatus
  ): string {
    switch (status) {
      case BookingStatus.Confirmed:
        return 'confirmed';

      case BookingStatus.Cancelled:
        return 'cancelled';

      case BookingStatus.Completed:
        return 'completed';

      default:
        return 'pending';
    }
  }

  planLabel(
    plan: BookingRentalPlan
  ): string {
    switch (plan) {
      case BookingRentalPlan.Weekly:
        return 'Weekly';

      case BookingRentalPlan.Monthly:
        return 'Monthly';

      default:
        return 'Daily';
    }
  }

  reload(): void {
    this.loadDashboard();
  }
}
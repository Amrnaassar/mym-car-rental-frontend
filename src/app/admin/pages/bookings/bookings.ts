import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  BookingResponse,
  BookingStatus,
  BookingRentalPlan
} from '../../../core/models/booking.model';

import { AdminBookingsService } from '../../core/services/admin-bookings';
import { AlertService } from '../../../shared/services/alert.service';
@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class Bookings implements OnInit {
  private readonly bookingsService =
    inject(AdminBookingsService);

  private readonly alertService =
    inject(AlertService);

  private readonly router =
    inject(Router);

  readonly BookingStatus = BookingStatus;

  readonly bookings =
    signal<BookingResponse[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal<string | null>(null);

  readonly search =
    signal('');

  readonly statusFilter =
    signal<'all' | BookingStatus>('all');

  readonly planFilter =
    signal<'all' | BookingRentalPlan>('all');

  readonly filteredBookings =
    computed(() => {
      const query =
        this.search()
          .trim()
          .toLowerCase();

      const status =
        this.statusFilter();

      const plan =
        this.planFilter();

      return this.bookings().filter(booking => {
        const matchesSearch =
          !query ||
          booking.bookingNumber
            .toLowerCase()
            .includes(query) ||
          booking.customerFullName
            .toLowerCase()
            .includes(query) ||
          booking.customerEmail
            .toLowerCase()
            .includes(query) ||
          booking.carName
            .toLowerCase()
            .includes(query) ||
          booking.pickupLocation
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          status == 'all' ||
          booking.status == status;

        const matchesPlan =
          plan == 'all' ||
          booking.rentalPlan == plan;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPlan
        );
      });
    });

  readonly pendingCount = computed(
    () =>
      this.bookings().filter(
        booking =>
          booking.status ==
          BookingStatus.Pending
      ).length
  );

  readonly confirmedCount = computed(
    () =>
      this.bookings().filter(
        booking =>
          booking.status ==
          BookingStatus.Confirmed
      ).length
  );

  readonly completedCount = computed(
    () =>
      this.bookings().filter(
        booking =>
          booking.status ==
          BookingStatus.Completed
      ).length
  );

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.bookingsService
      .getAll()
      .subscribe({
        next: bookings => {
          this.bookings.set(bookings);
          this.loading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to load bookings:',
            error
          );

          this.loading.set(false);

          const message =
            error.error?.message ??
            'Failed to load bookings.';

          this.errorMessage.set(message);

          this.alertService.error(
            'Unable to Load Bookings',
            message
          );
        }
      });
  }

  viewBooking(id: string): void {
    this.router.navigate([
      '/admin/bookings',
      id
    ]);
  }

  changeStatus(
    booking: BookingResponse,
    status: BookingStatus
  ): void {
    if (booking.status == status) {
      return;
    }

    this.errorMessage.set(null);

    this.bookingsService
      .updateStatus(
        booking.id,
        status
      )
      .subscribe({
        next: () => {
          this.bookings.update(
            bookings =>
              bookings.map(item =>
                item.id == booking.id
                  ? {
                    ...item,
                    status
                  }
                  : item
              )
          );
          this.alertService.success(
            'Booking Status Updated',
            `Booking ${booking.bookingNumber} status has been updated successfully.`
          );
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to update booking status:',
            error
          );

          const message =
            error.error?.message ??
            'Failed to update booking status.';

          this.errorMessage.set(message);

          this.alertService.error(
            'Status Update Failed',
            message
          );
        }
      });
  }

  cancelBooking(
    booking: BookingResponse
  ): void {
    if (
      booking.status ==
      BookingStatus.Completed
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Cancel booking ${booking.bookingNumber}?`
      );

    if (!confirmed) {
      return;
    }

    this.errorMessage.set(null);

    this.bookingsService
      .cancel(booking.id)
      .subscribe({
        next: () => {
          this.bookings.update(
            bookings =>
              bookings.map(item =>
                item.id == booking.id
                  ? {
                    ...item,
                    status:
                      BookingStatus.Cancelled
                  }
                  : item
              )
          );
          this.alertService.success(
            'Booking Cancelled',
            `Booking ${booking.bookingNumber} has been cancelled successfully.`
          );
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to cancel booking:',
            error
          );

          const message =
            error.error?.message ??
            'Failed to cancel booking.';

          this.errorMessage.set(message);

          this.alertService.error(
            'Cancellation Failed',
            message
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
}
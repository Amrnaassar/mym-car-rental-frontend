import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  BookingResponse,
  BookingRentalPlan,
  BookingStatus
} from '../../../../core/models/booking.model';

import {
  AdminBookingsService
} from '../../../core/services/admin-bookings';
@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})
export class BookingDetailsComponent implements OnInit {
  private readonly bookingsService =
    inject(AdminBookingsService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  readonly booking =
    signal<BookingResponse | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal<string | null>(null);

  readonly actionLoading =
    signal(false);

  readonly BookingStatus =
    BookingStatus;

  private bookingId = '';

  ngOnInit(): void {
    this.bookingId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.bookingId) {
      this.back();
      return;
    }

    this.loadBooking();
  }

  loadBooking(): void {
    this.loading.set(true);

    this.bookingsService
      .getById(this.bookingId)
      .subscribe({
        next: booking => {
          this.booking.set(booking);
          this.loading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          this.loading.set(false);

          this.errorMessage.set(
            error.error?.message ??
            'Failed to load booking.'
          );
        }
      });
  }

  updateStatus(
    status: BookingStatus
  ): void {
    const currentBooking =
      this.booking();

    if (!currentBooking) {
      return;
    }

    this.actionLoading.set(true);
    this.errorMessage.set(null);

    this.bookingsService
      .updateStatus(
        currentBooking.id,
        status
      )
      .subscribe({
        next: () => {
          this.booking.update(
            booking =>
              booking
                ? {
                    ...booking,
                    status
                  }
                : null
          );

          this.actionLoading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          this.actionLoading.set(false);

          this.errorMessage.set(
            error.error?.message ??
            'Failed to update booking status.'
          );
        }
      });
  }

  cancelBooking(): void {
    const currentBooking =
      this.booking();

    if (!currentBooking) {
      return;
    }

    if (
      currentBooking.status ===
      BookingStatus.Completed
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Cancel booking ${currentBooking.bookingNumber}?`
      );

    if (!confirmed) {
      return;
    }

    this.actionLoading.set(true);
    this.errorMessage.set(null);

    this.bookingsService
      .cancel(currentBooking.id)
      .subscribe({
        next: () => {
          this.booking.update(
            booking =>
              booking
                ? {
                    ...booking,
                    status:
                      BookingStatus.Cancelled
                  }
                : null
          );

          this.actionLoading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          this.actionLoading.set(false);

          this.errorMessage.set(
            error.error?.message ??
            'Failed to cancel booking.'
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

  back(): void {
    this.router.navigate([
      '/admin/bookings'
    ]);
  }
}
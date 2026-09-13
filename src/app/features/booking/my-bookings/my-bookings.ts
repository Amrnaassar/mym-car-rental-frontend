import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingResponse, BookingStatus, BookingRentalPlan } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';



@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss'
})
export class MyBookings implements OnInit {

  private readonly bookingService = inject(BookingService);

  bookings: BookingResponse[] = [];

  isLoading = true;
  cancellingId: string | null = null;
  errorMessage = '';

  readonly BookingStatus = BookingStatus;
  readonly BookingRentalPlan = BookingRentalPlan;

  ngOnInit(): void {
    this.loadBookings();
  }

  // ============================================================
  // LOAD MY BOOKINGS
  // ============================================================

  loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
        console.log(bookings);
      },

      error: (error) => {
        console.error('Failed to load bookings:', error);

        this.errorMessage =
          'Unable to load your bookings. Please try again.';

        this.isLoading = false;
      }
    });
  }

  // ============================================================
  // CANCEL BOOKING
  // ============================================================

  cancelBooking(booking: BookingResponse): void {

    if (!this.canCancel(booking)) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${booking.bookingNumber}?`
    );

    if (!confirmed) {
      return;
    }

    this.cancellingId = booking.id;

    this.bookingService.cancelBooking(booking.id).subscribe({
      next: () => {

        // Update locally instead of making another API request
        booking.status = BookingStatus.Cancelled;

        this.cancellingId = null;
      },

      error: (error) => {
        console.error('Failed to cancel booking:', error);

        this.cancellingId = null;

        window.alert(
          'Unable to cancel this booking. Please try again.'
        );
      }
    });
  }

  // ============================================================
  // CAN CANCEL?
  // ============================================================

  canCancel(booking: BookingResponse): boolean {
    return (
      booking.status !== BookingStatus.Cancelled &&
      booking.status !== BookingStatus.Completed
    );
  }

  // ============================================================
  // STATUS LABEL
  // ============================================================

  getStatusLabel(status: BookingStatus): string {

    switch (status) {

      case BookingStatus.Pending:
        return 'Pending';

      case BookingStatus.Confirmed:
        return 'Confirmed';

      case BookingStatus.Cancelled:
        return 'Cancelled';

      case BookingStatus.Completed:
        return 'Completed';

      default:
        return 'Unknown';
    }
  }

  // ============================================================
  // STATUS CLASS
  // ============================================================

  getStatusClass(status: BookingStatus): string {

    switch (status) {

      case BookingStatus.Pending:
        return 'status-pending';

      case BookingStatus.Confirmed:
        return 'status-confirmed';

      case BookingStatus.Cancelled:
        return 'status-cancelled';

      case BookingStatus.Completed:
        return 'status-completed';

      default:
        return '';
    }
  }

  // ============================================================
  // RENTAL PLAN LABEL
  // ============================================================

  getRentalPlanLabel(plan: BookingRentalPlan): string {

    switch (plan) {

      case BookingRentalPlan.Daily:
        return 'Daily';

      case BookingRentalPlan.Weekly:
        return 'Weekly';

      case BookingRentalPlan.Monthly:
        return 'Monthly';

      default:
        return 'Unknown';
    }
  }

  // ============================================================
  // DATE FORMAT
  // ============================================================

  formatDate(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // ============================================================
  // DATE + TIME
  // ============================================================

  formatDateTime(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByBookingId(
    index: number,
    booking: BookingResponse
  ): string {
    return booking.id;
  }
}
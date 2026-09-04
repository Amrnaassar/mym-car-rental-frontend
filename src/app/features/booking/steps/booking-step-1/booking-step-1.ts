import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BookingModel
} from '../../../../core/models/booking.model';

import { Car } from '../../../../core/models/car.model';

@Component({
  selector: 'app-booking-step-1',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './booking-step-1.html',
  styleUrl: './booking-step-1.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingStep1 {

  @Input({ required: true })
  booking!: BookingModel;

  @Input()
  car: Car | undefined;

  @Input()
  rentalDays = 0;

  @Input()
  currentPrice = 0;

  @Input()
  currentPlanLabel = 'Day';

  @Input()
  grandTotal = 0;

  @Output()
  bookingChange = new EventEmitter<Partial<BookingModel>>();

  @Output()
  next = new EventEmitter<void>();

  onPickupDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.bookingChange.emit({
      pickupDate: input.value
    });
  }

  onReturnDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.bookingChange.emit({
      returnDate: input.value
    });
  }

  onLocationChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.bookingChange.emit({
      pickupLocation: select.value
    });
  }

  continue(): void {
    this.next.emit();
  }
}
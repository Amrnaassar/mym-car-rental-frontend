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

@Component({
  selector: 'app-booking-step-3',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './booking-step-3.html',
  styleUrl: './booking-step-3.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingStep3 {

  @Input({ required: true })
  booking!: BookingModel;

  @Input()
  rentalDays = 0;

  @Input()
  rentalPrice = 0;

  @Input()
  insurancePrice = 0;

  @Input()
  grandTotal = 0;

  @Input()
  currentPlanLabel = 'Day';

  @Input()
  isSubmitting = false;

  @Input()
  bookingError = '';

  @Output()
  confirm = new EventEmitter<void>();

  @Output()
  back = new EventEmitter<void>();


  confirmBooking(): void {

    if (this.isSubmitting) {
      return;
    }

    this.confirm.emit();

  }


  previous(): void {
    if (!this.isSubmitting) {
      this.back.emit();
    }
  }

}
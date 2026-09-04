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
  selector: 'app-booking-step-2',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './booking-step-2.html',
  styleUrl: './booking-step-2.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingStep2 {

  @Input({ required: true })
  booking!: BookingModel;

  @Input()
  rentalDays = 0;

  @Input()
  grandTotal = 0;

  @Input()
  insurancePrice = 0;

  @Output()
  bookingChange = new EventEmitter<Partial<BookingModel>>();

  @Output()
  next = new EventEmitter<void>();

  @Output()
  back = new EventEmitter<void>();


  onTextChange(
    field:
      | 'customerFullName'
      | 'customerEmail'
      | 'customerPhone'
      | 'drivingLicense'
      | 'notes',
    event: Event
  ): void {

    const input = event.target as HTMLInputElement | HTMLTextAreaElement;

    this.bookingChange.emit({
      [field]: input.value
    });
  }


  onInsuranceChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.bookingChange.emit({
      includeInsurance: input.checked
    });
  }


  continue(): void {
    this.next.emit();
  }


  previous(): void {
    this.back.emit();
  }


  get isValid(): boolean {

    return !!(
      this.booking.customerFullName.trim() &&
      this.isValidEmail(this.booking.customerEmail) &&
      this.booking.customerPhone.trim() &&
      this.booking.drivingLicense.trim()
    );

  }


  private isValidEmail(email: string): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    );

  }

}
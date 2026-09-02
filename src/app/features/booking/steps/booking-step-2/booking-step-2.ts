import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker';

import { Car } from '../../../../core/models/car.model';
import { BookingModel } from '../../../../core/models/booking.model';


@Component({
  selector: 'app-booking-step-2',

  standalone: true,

  imports: [
    CommonModule,
    DatePickerComponent
  ],

  templateUrl: './booking-step-2.html',

  styleUrl: './booking-step-2.scss',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingStep2 {

  @Input({ required: true }) booking!: BookingModel;

  @Input({ required: true })car!: Car;

  @Input() currentPrice = 0;

  @Input() currentPlanLabel = 'Day';

  @Input() rentalDays = 0;

  @Input() grandTotal = 0;

  @Input() formatDate!: (value: string) => string;

  @Output() bookingChange = new EventEmitter<Partial<BookingModel>>();

  @Output() back =  new EventEmitter<void>();

  @Output()continue = new EventEmitter<void>();


  updateField(
    field: keyof BookingModel,
    value: string
  ): void {

    this.bookingChange.emit({
      [field]: value
    });
  }


  setPickupDate(value: string): void {

    const changes: Partial<BookingModel> = {
      pickupDate: value
    };

    if (
      this.booking.returnDate &&
      value &&
      this.booking.returnDate <= value
    ) {
      changes.returnDate = '';
    }

    this.bookingChange.emit(changes);
  }


  setReturnDate(value: string): void {

    this.bookingChange.emit({
      returnDate: value
    });
  }


  onBack(): void {
    this.back.emit();
  }


  onContinue(): void {
    this.continue.emit();
  }
}
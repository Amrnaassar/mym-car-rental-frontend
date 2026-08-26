import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Car } from '../../../../core/models/car.model';
import { BookingModel } from '../../../../core/models/booking.model';


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

  @Input({ required: true })
  car!: Car;

  @Input()
  currentPrice = 0;

  @Input()
  currentPlanLabel = 'Day';

  @Input()
  activeRate = 0;

  @Input()
  rentalDays = 0;

  @Input()
  grandTotal = 0;

  @Input()
  formatDate!: (value: string) => string;

  @Output()
  bookingChange =
    new EventEmitter<Partial<BookingModel>>();

  @Output()
  continue =
    new EventEmitter<void>();


  onContinue(): void {

    this.continue.emit();
  }
}
import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { Car } from '../../../../core/models/car.model';
import { BookingModel } from '../../../../core/models/booking.model';


@Component({
  selector: 'app-booking-step-4',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './booking-step-4.html',

  styleUrl: './booking-step-4.scss',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingStep4 {

  @Input({ required: true })
  booking!: BookingModel;

  @Input({ required: true })
  car!: Car;

  @Input()
  currentPrice = 0;

  @Input()
  currentPlanLabel = 'Day';

  @Input()
  rentalDays = 0;

  @Input()
  grandTotal = 0;

  @Input()
  formatDate!: (value: string) => string;
}
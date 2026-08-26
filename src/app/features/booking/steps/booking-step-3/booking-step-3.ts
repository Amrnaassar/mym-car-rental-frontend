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

  @Input({ required: true })
  car!: Car;

  @Input()
  currentPlanLabel = 'Day';

  @Input()
  rentalDays = 0;

  @Input()
  totalPrice = 0;

  @Input()
  insurancePrice = 0;

  @Input()
  grandTotal = 0;

  @Input()
  formatDate!: (value: string) => string;

  @Output()
  goToStep =
    new EventEmitter<number>();

  @Output()
  back =
    new EventEmitter<void>();

  @Output()
  confirm =
    new EventEmitter<void>();


  editDetails(): void {

    this.goToStep.emit(2);
  }


  onBack(): void {

    this.back.emit();
  }


  onConfirm(): void {

    this.confirm.emit();
  }
}
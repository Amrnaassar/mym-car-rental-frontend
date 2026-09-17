import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  BookingModel
} from '../../../../core/models/booking.model';

import { Car, FuelType, Transmission } from '../../../../core/models/car.model';

import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker';
import { LanguageService } from '../../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-step-1',
  standalone: true,
  imports: [
    CommonModule,
    DatePickerComponent,
    TranslatePipe
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


  private languageService = inject(LanguageService);  
  currentLanguage = this.languageService.currentLanguage();
  getCategoryName(car: Car): string {

    return this.currentLanguage === 'ar'
      ? car.categoryNameAr
      : car.categoryNameEn;
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  showValidation = false;


  // ============================================================
  // PICKUP DATE
  // ============================================================

  get pickupDateError(): string {
    if (!this.showValidation) {
      return '';
    }

    if (!this.booking.pickupDate) {
      return 'Please select a pickup date.';
    }

    return '';
  }


  // ============================================================
  // RETURN DATE
  // ============================================================

  get returnDateError(): string {
    if (!this.showValidation) {
      return '';
    }

    if (!this.booking.returnDate) {
      return 'Please select a return date.';
    }

    if (
      this.booking.pickupDate &&
      this.booking.returnDate
    ) {
      const pickup = this.parseDate(
        this.booking.pickupDate
      );

      const returnDate = this.parseDate(
        this.booking.returnDate
      );

      if (
        pickup &&
        returnDate &&
        returnDate <= pickup
      ) {
        return 'Return date must be after pickup date.';
      }
    }

    return '';
  }


  // ============================================================
  // PICKUP LOCATION
  // ============================================================

  get pickupLocationError(): string {
    if (!this.showValidation) {
      return '';
    }

    if (!this.booking.pickupLocation) {
      return 'Please select a pickup location.';
    }

    return '';
  }


  // ============================================================
  // DATE CHANGES
  // ============================================================

  onPickupDateChange(value: string): void {
    this.bookingChange.emit({
      pickupDate: value
    });
  }


  onReturnDateChange(value: string): void {
    this.bookingChange.emit({
      returnDate: value
    });
  }


  // ============================================================
  // LOCATION
  // ============================================================

  onLocationChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.bookingChange.emit({
      pickupLocation: select.value
    });
  }


  // ============================================================
  // CONTINUE
  // ============================================================

  continue(): void {
    this.showValidation = true;

    if (!this.isValid()) {
      return;
    }

    this.next.emit();
  }


  // ============================================================
  // FORM VALIDATION
  // ============================================================

  private isValid(): boolean {
    if (!this.booking.pickupDate) {
      return false;
    }

    if (!this.booking.returnDate) {
      return false;
    }

    if (!this.booking.pickupLocation) {
      return false;
    }

    const pickup = this.parseDate(
      this.booking.pickupDate
    );

    const returnDate = this.parseDate(
      this.booking.returnDate
    );

    if (!pickup || !returnDate) {
      return false;
    }

    if (returnDate <= pickup) {
      return false;
    }

    return true;
  }


  // ============================================================
  // DATE PARSER
  // ============================================================

  private parseDate(value: string): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }
   getFuelTypeLabel(fuelType: FuelType): string {
    return FuelType[fuelType];
  }

  getTransmissionLabel(transmission: Transmission): string {
    return Transmission[transmission];
  }
}
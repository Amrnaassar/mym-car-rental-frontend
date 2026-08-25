import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { DatePickerComponent } from '../../shared/components/date-picker/date-picker';

import {
  Car,
  RentalPlan
} from '../../core/models/car.model';

import { CarService } from '../../core/services/car-service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePickerComponent
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Booking {

  // ============================================================
  // DEPENDENCIES
  // ============================================================

  private readonly route = inject(ActivatedRoute);
  private readonly carService = inject(CarService);


  // ============================================================
  // BOOKING STEP
  // ============================================================

  readonly currentStep = signal<number>(1);


  // ============================================================
  // CAR
  // ============================================================

  readonly carId = signal<number | null>(null);

  readonly car = computed<Car | undefined>(() => {
    const id = this.carId();

    if (!id) {
      return undefined;
    }

    return this.carService.getCarById(id);
  });


  // ============================================================
  // BOOKING DATA
  // ============================================================

  readonly pickupDate = signal<string>('');
  readonly returnDate = signal<string>('');
  readonly pickupLocation = signal<string>('');


  // ============================================================
  // CUSTOMER DATA
  // ============================================================

  readonly fullName = signal<string>('');
  readonly email = signal<string>('');
  readonly phone = signal<string>('');
  readonly drivingLicense = signal<string>('');


  // ============================================================
  // INSURANCE
  // ============================================================

  /**
   * Temporary fixed insurance amount.
   *
   * This should later come from the pricing/business rules
   * or backend.
   */
  readonly insurancePrice = 1000;


  // ============================================================
  // LOAD QUERY PARAMETERS
  // ============================================================

  constructor() {
    this.route.queryParams.subscribe(params => {

      // ----------------------------------------------------------
      // CAR ID
      // ----------------------------------------------------------

      const carId = Number(params['car']);

      if (Number.isInteger(carId) && carId > 0) {
        this.carId.set(carId);
      } else {
        this.carId.set(null);
      }


      // ----------------------------------------------------------
      // OPTIONAL BOOKING DATA
      // ----------------------------------------------------------

      this.pickupDate.set(
        this.normalizeDateValue(params['pickupDate'])
      );

      this.returnDate.set(
        this.normalizeDateValue(params['returnDate'])
      );

      this.pickupLocation.set(
        params['location'] ?? ''
      );
    });
  }


  // ============================================================
  // RENTAL DAYS
  // ============================================================

  readonly rentalDays = computed<number>(() => {

    const pickupValue = this.pickupDate();
    const returnValue = this.returnDate();

    if (!pickupValue || !returnValue) {
      return 0;
    }

    const pickup = this.parseDate(pickupValue);
    const returnDate = this.parseDate(returnValue);

    if (!pickup || !returnDate) {
      return 0;
    }

    const difference =
      returnDate.getTime() - pickup.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return Math.max(days, 0);
  });


  // ============================================================
  // AUTOMATIC RENTAL PLAN
  // ============================================================

  /**
   * Business rule:
   *
   * 1 - 6 days  -> Daily
   * 7 - 29 days -> Weekly
   * 30+ days    -> Monthly
   */
  readonly rentalPlan = computed<RentalPlan>(() => {

    const days = this.rentalDays();

    if (days >= 30) {
      return 'monthly';
    }

    if (days >= 7) {
      return 'weekly';
    }

    return 'daily';
  });


  // ============================================================
  // CURRENT PRICE
  // ============================================================

  readonly currentPrice = computed<number>(() => {

    const currentCar = this.car();

    if (!currentCar) {
      return 0;
    }

    switch (this.rentalPlan()) {

      case 'weekly':
        return currentCar.pricePerWeek;

      case 'monthly':
        return currentCar.pricePerMonth;

      case 'daily':
      default:
        return currentCar.pricePerDay;
    }
  });


  // ============================================================
  // CURRENT PLAN LABEL
  // ============================================================

  readonly currentPlanLabel = computed<string>(() => {

    switch (this.rentalPlan()) {

      case 'weekly':
        return 'Week';

      case 'monthly':
        return 'Month';

      case 'daily':
      default:
        return 'Day';
    }
  });


  // ============================================================
  // ACTIVE RATE
  // ============================================================

  readonly activeRate = computed<number>(() => {

    const currentCar = this.car();

    if (!currentCar) {
      return 0;
    }

    switch (this.rentalPlan()) {

      case 'weekly':
        return currentCar.pricePerWeek;

      case 'monthly':
        return currentCar.pricePerMonth;

      case 'daily':
      default:
        return currentCar.pricePerDay;
    }
  });


  // ============================================================
  // ACTIVE RATE LABEL
  // ============================================================

  readonly activeRateLabel = computed<string>(() => {

    switch (this.rentalPlan()) {

      case 'weekly':
        return 'Weekly Rate';

      case 'monthly':
        return 'Monthly Rate';

      case 'daily':
      default:
        return 'Day Rate';
    }
  });


  // ============================================================
  // TOTAL RENTAL PRICE
  // ============================================================

  /**
   * Current pricing strategy:
   *
   * < 7 days:
   *   Daily rate × days
   *
   * 7 - 29 days:
   *   Weekly rate prorated by day
   *
   * 30+ days:
   *   Monthly rate prorated by day
   *
   * This pricing rule should later be moved to the backend
   * and duplicated there as the source of truth.
   */
  readonly totalPrice = computed<number>(() => {

    const currentCar = this.car();
    const days = this.rentalDays();

    if (!currentCar || days <= 0) {
      return 0;
    }

    // ----------------------------------------------------------
    // DAILY
    // ----------------------------------------------------------

    if (days < 7) {
      return days * currentCar.pricePerDay;
    }


    // ----------------------------------------------------------
    // WEEKLY
    // ----------------------------------------------------------

    if (days < 30) {
      return days * (
        currentCar.pricePerWeek / 7
      );
    }


    // ----------------------------------------------------------
    // MONTHLY
    // ----------------------------------------------------------

    return days * (
      currentCar.pricePerMonth / 30
    );
  });


  // ============================================================
  // GRAND TOTAL
  // ============================================================

  readonly grandTotal = computed<number>(() => {

    const rentalTotal = this.totalPrice();

    if (rentalTotal <= 0) {
      return 0;
    }

    return rentalTotal + this.insurancePrice;
  });


  // ============================================================
  // STEP NAVIGATION
  // ============================================================

  nextStep(): void {

    const current = this.currentStep();

    if (current >= 4) {
      return;
    }

    if (current === 1 && !this.canContinueFromStepOne()) {
      return;
    }

    if (current === 2 && !this.canContinueFromStepTwo()) {
      return;
    }

    this.currentStep.set(current + 1);
  }


  previousStep(): void {

    const current = this.currentStep();

    if (current <= 1) {
      return;
    }

    this.currentStep.set(current - 1);
  }


  goToStep(step: number): void {

    const current = this.currentStep();

    if (
      step < 1 ||
      step > current
    ) {
      return;
    }

    this.currentStep.set(step);
  }


  // ============================================================
  // STEP HELPERS
  // ============================================================

  isCompleted(step: number): boolean {
    return step < this.currentStep();
  }


  isActive(step: number): boolean {
    return step === this.currentStep();
  }


  // ============================================================
  // STEP 1 VALIDATION
  // ============================================================

  canContinueFromStepOne(): boolean {
    return !!this.car();
  }


  // ============================================================
  // STEP 2 VALIDATION
  // ============================================================

  canContinueFromStepTwo(): boolean {

    const fullName = this.fullName().trim();
    const email = this.email().trim();
    const phone = this.phone().trim();
    const drivingLicense = this.drivingLicense().trim();

    const pickupDate = this.pickupDate();
    const returnDate = this.returnDate();
    const location = this.pickupLocation();

    return !!(
      this.car() &&
      fullName &&
      this.isValidEmail(email) &&
      phone &&
      drivingLicense &&
      pickupDate &&
      returnDate &&
      location &&
      this.rentalDays() > 0
    );
  }


  // ============================================================
  // DATE VALIDATION
  // ============================================================

  private isValidDateRange(): boolean {

    const pickup = this.parseDate(
      this.pickupDate()
    );

    const returnDate = this.parseDate(
      this.returnDate()
    );

    if (!pickup || !returnDate) {
      return false;
    }

    return returnDate.getTime() > pickup.getTime();
  }


  // ============================================================
  // EMAIL VALIDATION
  // ============================================================

  private isValidEmail(email: string): boolean {

    if (!email) {
      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }


  // ============================================================
  // DATE PARSER
  // ============================================================

  private parseDate(value: string): Date | null {

    if (!value) {
      return null;
    }

    const parts = value.split('-');

    if (parts.length !== 3) {
      return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    ) {
      return null;
    }

    const date = new Date(
      year,
      month - 1,
      day
    );

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }


  // ============================================================
  // NORMALIZE QUERY DATE
  // ============================================================

  private normalizeDateValue(value: unknown): string {

    if (typeof value !== 'string') {
      return '';
    }

    const date = this.parseDate(value);

    if (!date) {
      return '';
    }

    return value;
  }


  // ============================================================
  // FORMAT DATE
  // ============================================================

  formatDate(value: string): string {

    if (!value) {
      return 'Not selected';
    }

    const date = this.parseDate(value);

    if (!date) {
      return 'Not selected';
    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(date);
  }


  // ============================================================
  // FORM INPUT HELPERS
  // ============================================================

  setFullName(value: string): void {
    this.fullName.set(value);
  }


  setEmail(value: string): void {
    this.email.set(value);
  }


  setPhone(value: string): void {
    this.phone.set(value);
  }


  setDrivingLicense(value: string): void {
    this.drivingLicense.set(value);
  }


  setPickupDate(value: string): void {

    this.pickupDate.set(value);

    // If the new pickup date is after the current
    // return date, clear the invalid return date.
    if (
      this.returnDate() &&
      this.rentalDays() <= 0
    ) {
      this.returnDate.set('');
    }
  }


  setReturnDate(value: string): void {
    this.returnDate.set(value);
  }


  setPickupLocation(value: string): void {
    this.pickupLocation.set(value);
  }
}
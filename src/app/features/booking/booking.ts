import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';


import { CarService } from '../../core/services/car-service';


import { BookingStep1 } from './steps/booking-step-1/booking-step-1';
import { BookingStep2 } from './steps/booking-step-2/booking-step-2';
import { BookingStep3 } from './steps/booking-step-3/booking-step-3';
import { BookingStep4 } from './steps/booking-step-4/booking-step-4';
import { BookingModel } from '../../core/models/booking.model';
import { Car, RentalPlan } from '../../core/models/car.model';

@Component({
  selector: 'app-booking',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    BookingStep1,
    BookingStep2,
    BookingStep3,
    BookingStep4
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
  // BOOKING MODEL
  // ============================================================

  readonly booking = signal<BookingModel>({
    carId: null,

    pickupDate: '',
    returnDate: '',
    pickupLocation: '',

    rentalPlan: 'daily',

    fullName: '',
    email: '',
    phone: '',
    drivingLicense: '',

    rentalDays: 0,
    rentalPrice: 0,
    insurancePrice: 1000,
    grandTotal: 0
  });


  // ============================================================
  // CAR
  // ============================================================

  readonly car = computed<Car | undefined>(() => {

    const id = this.booking().carId;

    if (!id) {
      return undefined;
    }

    return this.carService.getCarById(id);
  });


  // ============================================================
  // SHORTCUTS
  // ============================================================

  readonly pickupDate = computed(
    () => this.booking().pickupDate
  );

  readonly returnDate = computed(
    () => this.booking().returnDate
  );

  readonly pickupLocation = computed(
    () => this.booking().pickupLocation
  );

  readonly fullName = computed(
    () => this.booking().fullName
  );

  readonly email = computed(
    () => this.booking().email
  );

  readonly phone = computed(
    () => this.booking().phone
  );

  readonly drivingLicense = computed(
    () => this.booking().drivingLicense
  );


  // ============================================================
  // RENTAL DAYS
  // ============================================================

  readonly rentalDays = computed<number>(() => {

    const {
      pickupDate,
      returnDate
    } = this.booking();

    if (!pickupDate || !returnDate) {
      return 0;
    }

    const pickup = this.parseDate(pickupDate);

    const returnDateValue = this.parseDate(returnDate);

    if (!pickup || !returnDateValue) {
      return 0;
    }

    const difference =
      returnDateValue.getTime() -
      pickup.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return Math.max(days, 0);
  });


  // ============================================================
  // RENTAL PLAN
  // ============================================================

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
  // PLAN LABEL
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

    return this.currentPrice();
  });


  // ============================================================
  // TOTAL RENTAL PRICE
  // ============================================================

  readonly totalPrice = computed<number>(() => {

    const currentCar = this.car();

    const days = this.rentalDays();

    if (!currentCar || days <= 0) {
      return 0;
    }

    if (days < 7) {

      return days *
        currentCar.pricePerDay;
    }

    if (days < 30) {

      return days *
        (currentCar.pricePerWeek / 7);
    }

    return days *
      (currentCar.pricePerMonth / 30);
  });


  // ============================================================
  // INSURANCE
  // ============================================================

  readonly insurancePrice = 1000;


  // ============================================================
  // GRAND TOTAL
  // ============================================================

  readonly grandTotal = computed<number>(() => {

    const rentalTotal = this.totalPrice();

    if (rentalTotal <= 0) {
      return 0;
    }

    return rentalTotal +
      this.insurancePrice;
  });


  // ============================================================
  // LOAD QUERY PARAMETERS
  // ============================================================

  constructor() {
    effect(() => {
      this.currentStep();

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
    this.route.queryParams.subscribe(params => {

      const carId = Number(params['car']);

      this.booking.update(current => ({
        ...current,

        carId:
          Number.isInteger(carId) && carId > 0
            ? carId
            : null,

        pickupDate:
          this.normalizeDateValue(
            params['pickupDate']
          ),

        returnDate:
          this.normalizeDateValue(
            params['returnDate']
          ),

        pickupLocation:
          params['location'] ?? ''
      }));

      this.syncCalculatedValues();
    });
  }


  // ============================================================
  // UPDATE BOOKING
  // ============================================================

  updateBooking(
    changes: Partial<BookingModel>
  ): void {

    this.booking.update(current => ({
      ...current,
      ...changes
    }));

    this.syncCalculatedValues();
  }


  // ============================================================
  // SYNC CALCULATED VALUES
  // ============================================================

  private syncCalculatedValues(): void {

    const days = this.rentalDays();

    const plan = this.rentalPlan();

    const rentalPrice = this.totalPrice();

    const grandTotal =
      rentalPrice > 0
        ? rentalPrice + this.insurancePrice
        : 0;

    this.booking.update(current => ({
      ...current,

      rentalPlan: plan,

      rentalDays: days,

      rentalPrice,

      insurancePrice: this.insurancePrice,

      grandTotal
    }));
  }


  // ============================================================
  // STEP NAVIGATION
  // ============================================================

  nextStep(): void {

    const current = this.currentStep();

    if (current >= 4) {
      return;
    }

    if (
      current === 1 &&
      !this.canContinueFromStepOne()
    ) {
      return;
    }

    if (
      current === 2 &&
      !this.canContinueFromStepTwo()
    ) {
      return;
    }

    this.currentStep.set(current + 1);
  }


  // ============================================================
  // PREVIOUS STEP
  // ============================================================

  previousStep(): void {

    const current = this.currentStep();

    if (current <= 1) {
      return;
    }

    this.currentStep.set(current - 1);
  }


  // ============================================================
  // GO TO STEP
  // ============================================================

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

    const data = this.booking();

    const fullName =
      data.fullName.trim();

    const email =
      data.email.trim();

    const phone =
      data.phone.trim();

    const drivingLicense =
      data.drivingLicense.trim();

    return !!(
      this.car() &&

      fullName &&

      this.isValidEmail(email) &&

      phone &&

      drivingLicense &&

      data.pickupDate &&

      data.returnDate &&

      data.pickupLocation &&

      this.rentalDays() > 0 &&

      this.isValidDateRange()
    );
  }


  // ============================================================
  // DATE VALIDATION
  // ============================================================

  private isValidDateRange(): boolean {

    const pickup =
      this.parseDate(
        this.booking().pickupDate
      );

    const returnDate =
      this.parseDate(
        this.booking().returnDate
      );

    if (!pickup || !returnDate) {
      return false;
    }

    return (
      returnDate.getTime() >
      pickup.getTime()
    );
  }


  // ============================================================
  // EMAIL VALIDATION
  // ============================================================

  private isValidEmail(
    email: string
  ): boolean {

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

  private parseDate(
    value: string
  ): Date | null {

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

  private normalizeDateValue(
    value: unknown
  ): string {

    if (typeof value !== 'string') {
      return '';
    }

    const date =
      this.parseDate(value);

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

    const date =
      this.parseDate(value);

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
  // CONFIRM BOOKING
  // ============================================================

  confirmBooking(): void {

    if (!this.canContinueFromStepTwo()) {
      return;
    }

    this.syncCalculatedValues();

    this.currentStep.set(4);

    /*
     * Later:
     *
     * this.bookingService
     *   .createBooking(this.booking())
     *
     * will send the model to the backend.
     */
  }
}
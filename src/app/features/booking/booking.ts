import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import {
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop';

import {
  distinctUntilChanged,
  map,
  of,
  switchMap
} from 'rxjs';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import {

  BookingModel,
  BookingRentalPlan,
  BookingResponse,
  CreateBookingDto
} from '../../core/models/booking.model';

import { Car } from '../../core/models/car.model';

import { BookingStep1 } from './steps/booking-step-1/booking-step-1';
import { BookingStep2 } from './steps/booking-step-2/booking-step-2';
import { BookingStep3 } from './steps/booking-step-3/booking-step-3';
import { BookingStep4 } from './steps/booking-step-4/booking-step-4';
import { BookingService } from '../../core/services/booking.service';
import { CarService } from '../../core/services/car.service';

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
  private readonly bookingService = inject(BookingService);
  private readonly platformId = inject(PLATFORM_ID);

  // ============================================================
  // BOOKING STEP
  // ============================================================

  readonly currentStep = signal<number>(1);

  // ============================================================
  // BOOKING FORM
  // ============================================================

  readonly booking = signal<BookingModel>({
    carId: null,

    pickupDate: '',
    returnDate: '',
    pickupLocation: '',

    customerFullName: '',
    customerEmail: '',
    customerPhone: '',
    drivingLicense: '',

    includeInsurance: false,

    notes: '',

    rentalPlan: BookingRentalPlan.Daily,
    rentalDays: 0,
    rentalPrice: 0,
    insurancePrice: 0,
    grandTotal: 0
  });

  // ============================================================
  // CREATED BOOKING
  // Backend response after successful confirmation
  // ============================================================

  readonly createdBooking = signal<BookingResponse | null>(null);

  // ============================================================
  // SUBMIT STATE
  // ============================================================

  readonly isSubmitting = signal<boolean>(false);

  // ============================================================
  // ERROR STATE
  // ============================================================

  readonly bookingError = signal<string>('');

  // ============================================================
  // CAR
  // ============================================================

  readonly car = toSignal(
    toObservable(this.booking).pipe(
      map(booking => booking.carId),
      distinctUntilChanged(),
      switchMap(id =>
        id
          ? this.carService.getCarById(id)
          : of(undefined)
      )
    ),
    { initialValue: undefined }
  );

  // ============================================================
  // RENTAL DAYS
  // Must match backend:
  // ceil(returnDate - pickupDate)
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
      difference /
      (1000 * 60 * 60 * 24)
    );

    return Math.max(days, 0);
  });

  // ============================================================
  // RENTAL PLAN
  // Must match backend:
  //
  // < 7  => Daily
  // < 30 => Weekly
  // >=30 => Monthly
  // ============================================================

  readonly rentalPlan = computed<BookingRentalPlan>(() => {

    const days = this.rentalDays();

    if (days < 7) {
      return BookingRentalPlan.Daily;
    }

    if (days < 30) {
      return BookingRentalPlan.Weekly;
    }

    return BookingRentalPlan.Monthly;
  });

  // ============================================================
  // CURRENT RATE
  // ============================================================

  readonly currentPrice = computed<number>(() => {

    const currentCar = this.car();

    if (!currentCar) {
      return 0;
    }

    switch (this.rentalPlan()) {

      case BookingRentalPlan.Weekly:
        return currentCar.pricePerWeek;

      case BookingRentalPlan.Monthly:
        return currentCar.pricePerMonth;

      case BookingRentalPlan.Daily:
      default:
        return currentCar.pricePerDay;
    }
  });

  // ============================================================
  // PLAN LABEL
  // ============================================================

  readonly currentPlanLabel = computed<string>(() => {

    switch (this.rentalPlan()) {

      case BookingRentalPlan.Weekly:
        return 'Week';

      case BookingRentalPlan.Monthly:
        return 'Month';

      case BookingRentalPlan.Daily:
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
  //
  // IMPORTANT:
  // This now matches Backend CalculateRentalCost()
  //
  // Weekly:
  // full weeks * weeklyRate
  // + remaining days * dailyRate
  //
  // Monthly:
  // full months * monthlyRate
  // + remaining days * dailyRate
  // ============================================================

  readonly totalPrice = computed<number>(() => {

    const currentCar = this.car();
    const days = this.rentalDays();

    if (!currentCar || days <= 0) {
      return 0;
    }

    switch (this.rentalPlan()) {

      case BookingRentalPlan.Weekly:
        return (
          Math.floor(days / 7) *
          currentCar.pricePerWeek
        ) +
          (
            days % 7 *
            currentCar.pricePerDay
          );

      case BookingRentalPlan.Monthly:
        return (
          Math.floor(days / 30) *
          currentCar.pricePerMonth
        ) +
          (
            days % 30 *
            currentCar.pricePerDay
          );

      case BookingRentalPlan.Daily:
      default:
        return (
          days *
          currentCar.pricePerDay
        );
    }
  });

  // ============================================================
  // INSURANCE
  // Backend uses fixed 1000 AED
  // ============================================================

  readonly insurancePrice = computed<number>(() => {

    return this.booking().includeInsurance
      ? 1000
      : 0;
  });

  // ============================================================
  // GRAND TOTAL
  //
  // Backend:
  // rentalCost
  // + insuranceCost
  // + taxCost
  // - discount
  //
  // Current Backend:
  // Tax = 0
  // Discount = 0
  // ============================================================

  readonly grandTotal = computed<number>(() => {

    const rentalTotal = this.totalPrice();
    const insurance = this.insurancePrice();

    if (rentalTotal <= 0) {
      return 0;
    }

    return (
      rentalTotal +
      insurance
    );
  });

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {

    // Scroll to top whenever booking step changes.
    effect(() => {
      this.currentStep();

      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });

    // Load booking data from query parameters.
    this.route.queryParams.subscribe(params => {

      const carId = Number(params['car']);

      this.booking.update(current => ({

        ...current,

        carId:
          Number.isInteger(carId) &&
            carId > 0
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
    const insurance = this.insurancePrice();

    const grandTotal =
      rentalPrice +
      insurance;

    this.booking.update(current => ({

      ...current,

      rentalPlan: plan,
      rentalDays: days,
      rentalPrice,
      insurancePrice: insurance,
      grandTotal
    }));
  }

  // ============================================================
  // CREATE API REQUEST
  //
  // IMPORTANT:
  // Only send fields expected by backend.
  // ============================================================

  private buildCreateBookingDto(): CreateBookingDto {

    const data = this.booking();

    if (!data.carId) {
      throw new InvalidOperationError(
        'A vehicle must be selected.'
      );
    }

    return {

      carId:
        data.carId,

      pickupLocation:
        data.pickupLocation.trim(),

      pickupDate:
        data.pickupDate,

      returnDate:
        data.returnDate,

      customerFullName:
        data.customerFullName.trim(),

      customerEmail:
        data.customerEmail
          .trim()
          .toLowerCase(),

      customerPhone:
        data.customerPhone.trim(),

      drivingLicense:
        data.drivingLicense.trim(),

      includeInsurance:
        data.includeInsurance,

      notes:
        data.notes.trim() || null
    };
  }

  // ============================================================
  // STEP NAVIGATION
  // ============================================================

  nextStep(): void {

    const current =
      this.currentStep();

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

    this.currentStep.set(
      current + 1
    );
  }

  // ============================================================
  // PREVIOUS STEP
  // ============================================================

  previousStep(): void {

    const current =
      this.currentStep();

    if (current <= 1) {
      return;
    }

    this.currentStep.set(
      current - 1
    );
  }

  // ============================================================
  // GO TO STEP
  // ============================================================

  goToStep(step: number): void {

    const current =
      this.currentStep();

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

    return !!(
      this.car() &&
      this.booking().pickupDate &&
      this.booking().returnDate &&
      this.booking().pickupLocation &&
      this.rentalDays() > 0 &&
      this.isValidDateRange()
    );
  }

  // ============================================================
  // STEP 2 VALIDATION
  // ============================================================

  canContinueFromStepTwo(): boolean {

    const data =
      this.booking();

    const fullName =
      data.customerFullName.trim();

    const email =
      data.customerEmail.trim();

    const phone =
      data.customerPhone.trim();

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

    const parts =
      value.split('-');

    if (parts.length !== 3) {
      return null;
    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    ) {
      return null;
    }

    const date =
      new Date(
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

  formatDate(
    value: string
  ): string {

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
  //
  // STEP 3 -> API -> STEP 4
  // ============================================================

  confirmBooking(): void {

    if (
      !this.canContinueFromStepTwo() ||
      this.isSubmitting()
    ) {
      return;
    }

    this.syncCalculatedValues();

    this.bookingError.set('');

    let dto: CreateBookingDto;

    try {

      dto =
        this.buildCreateBookingDto();

    } catch (error) {

      if (error instanceof InvalidOperationError) {
        this.bookingError.set(
          error.message
        );
      }

      return;
    }

    this.isSubmitting.set(true);

    this.bookingService
      .createBooking(dto)
      .subscribe({

        next: booking => {

          this.createdBooking.set(
            booking
          );

          this.isSubmitting.set(false);

          this.currentStep.set(4);
        },

        error: error => {

          this.isSubmitting.set(false);

          this.bookingError.set(
            this.getBookingErrorMessage(error)
          );
        }
      });
  }

  // ============================================================
  // API ERROR MESSAGE
  // ============================================================

  private getBookingErrorMessage(
    error: unknown
  ): string {

    const response =
      error as {
        error?: {
          message?: string;
          title?: string;
        };
        status?: number;
      };

    if (
      response?.error?.message
    ) {
      return response.error.message;
    }

    if (
      response?.status === 401
    ) {
      return 'Please login before confirming your booking.';
    }

    if (
      response?.status === 409
    ) {
      return 'The selected vehicle is not available for these dates.';
    }

    return 'Something went wrong while creating your booking. Please try again.';
  }
}

// ============================================================
// SMALL INTERNAL ERROR
// ============================================================

class InvalidOperationError extends Error {

  constructor(message: string) {

    super(message);

    this.name =
      'InvalidOperationError';
  }
}
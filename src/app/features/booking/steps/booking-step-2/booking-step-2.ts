
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { BookingModel } from '../../../../core/models/booking.model';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-booking-step-2',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
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


  /**
   * Controls when validation messages are displayed.
   */
  showValidation = false;


  // =========================================================
  // TEXT INPUT
  // =========================================================

  onTextChange(
    field:
      | 'customerFullName'
      | 'customerEmail'
      | 'customerPhone'
      | 'drivingLicense'
      | 'notes',
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement | HTMLTextAreaElement;

    this.bookingChange.emit({
      [field]: input.value
    });
  }


  // =========================================================
  // INSURANCE
  // =========================================================

  onInsuranceChange(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.bookingChange.emit({
      includeInsurance: input.checked
    });
  }


  // =========================================================
  // VALIDATION MESSAGES
  // =========================================================

  get fullNameError(): string {

    if (!this.showValidation) {
      return '';
    }

    const name = this.booking.customerFullName?.trim() ?? '';

    if (!name) {
      return 'Please enter your full name.';
    }

    if (name.length < 2) {
      return 'Full name must contain at least 2 characters.';
    }

    if (name.length > 100) {
      return 'Full name must not exceed 100 characters.';
    }

    if (!/^[\p{L}\s'-]+$/u.test(name)) {
      return 'Full name can only contain letters, spaces, hyphens, or apostrophes.';
    }

    return '';
  }


  get emailError(): string {

    if (!this.showValidation) {
      return '';
    }

    const email = this.booking.customerEmail?.trim() ?? '';

    if (!email) {
      return 'Please enter your email address.';
    }

    if (!this.isValidEmail(email)) {
      return 'Please enter a valid email address.';
    }

    return '';
  }


  get phoneError(): string {

    if (!this.showValidation) {
      return '';
    }

    const phone = this.booking.customerPhone?.trim() ?? '';

    if (!phone) {
      return 'Please enter your phone number.';
    }

    if (!this.isValidUaePhone(phone)) {
      return 'Please enter a valid UAE phone number.';
    }

    return '';
  }


  get drivingLicenseError(): string {

    if (!this.showValidation) {
      return '';
    }

    const license = this.booking.drivingLicense?.trim() ?? '';

    if (!license) {
      return 'Please enter your driving license number.';
    }

    if (license.length < 3) {
      return 'Driving license number must be at least 3 characters.';
    }

    if (license.length > 50) {
      return 'Driving license number must not exceed 50 characters.';
    }

    return '';
  }


  // =========================================================
  // CONTINUE
  // =========================================================

  continue(): void {

    this.showValidation = true;

    if (!this.isValid) {
      return;
    }

    this.next.emit();
  }


  // =========================================================
  // BACK
  // =========================================================

  previous(): void {
    this.back.emit();
  }


  // =========================================================
  // FORM VALIDATION
  // =========================================================

  get isValid(): boolean {

    const fullName =
      this.booking.customerFullName?.trim() ?? '';

    const email =
      this.booking.customerEmail?.trim() ?? '';

    const phone =
      this.booking.customerPhone?.trim() ?? '';

    const drivingLicense =
      this.booking.drivingLicense?.trim() ?? '';


    return (
      this.isValidFullName(fullName) &&
      this.isValidEmail(email) &&
      this.isValidUaePhone(phone) &&
      this.isValidDrivingLicense(drivingLicense)
    );
  }


  // =========================================================
  // FULL NAME
  // =========================================================

  private isValidFullName(name: string): boolean {

    if (!name) {
      return false;
    }

    if (name.length < 2 || name.length > 100) {
      return false;
    }

    return /^[\p{L}\s'-]+$/u.test(name);
  }


  // =========================================================
  // EMAIL
  // =========================================================

  private isValidEmail(email: string): boolean {

    if (!email) {
      return false;
    }

    if (email.length > 254) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }


  // =========================================================
  // UAE PHONE
  // =========================================================

  private isValidUaePhone(phone: string): boolean {

    if (!phone) {
      return false;
    }

    /*
     * Supported examples:
     *
     * 0501234567
     * 0521234567
     * 0541234567
     * 0551234567
     * 0561234567
     * 0581234567
     *
     * +971501234567
     * +971 50 123 4567
     *
     * 971501234567
     * 971 50 123 4567
     */

    const normalizedPhone = phone
      .replace(/[\s()-]/g, '')
      .trim();

    // Local UAE format: 05XXXXXXXX
    if (/^05[0-9]{8}$/.test(normalizedPhone)) {
      return true;
    }

    // International format: +9715XXXXXXXX
    if (/^\+9715[0-9]{8}$/.test(normalizedPhone)) {
      return true;
    }

    // International format without +
    if (/^9715[0-9]{8}$/.test(normalizedPhone)) {
      return true;
    }

    return false;
  }


  // =========================================================
  // DRIVING LICENSE
  // =========================================================

  private isValidDrivingLicense(
    license: string
  ): boolean {

    if (!license) {
      return false;
    }

    if (license.length < 3 || license.length > 50) {
      return false;
    }

    return true;
  }

}

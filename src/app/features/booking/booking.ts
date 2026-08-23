import {
  ChangeDetectionStrategy,
  Component,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Booking {

  /* ============================================================
     BOOKING STEPS
  ============================================================ */

  readonly currentStep = signal(1);


  /* ============================================================
     DEMO CAR
     Temporary until CarService is connected
  ============================================================ */

  readonly car = {
    id: 1,
    name: 'Mercedes S-Class',
    category: 'Luxury Sedan',
    image: 'assets/images/cars/mercedes-s-class.jpg',
    pricePerDay: 600,
    rating: 4.9,
    reviews: 120,
    transmission: 'Automatic',
    seats: 5,
    doors: 4,
    fuelType: 'Petrol'
  };


  /* ============================================================
     BOOKING DATA
  ============================================================ */

  readonly booking = {
    pickupDate: '20 May 2026',
    returnDate: '22 May 2026',
    pickupLocation: 'Dubai'
  };


  /* ============================================================
     STEP NAVIGATION
  ============================================================ */

  nextStep(): void {

    if (this.currentStep() < 4) {
      this.currentStep.update(step => step + 1);
    }

  }


  previousStep(): void {

    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }

  }


  goToStep(step: number): void {

    if (step <= this.currentStep()) {
      this.currentStep.set(step);
    }

  }


  /* ============================================================
     HELPERS
  ============================================================ */

  isCompleted(step: number): boolean {

    return step < this.currentStep();

  }


  isActive(step: number): boolean {

    return step === this.currentStep();

  }

}
import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { Car } from '../../../core/models/car.model';

import { CarService } from '../../../core/services/car.service';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-featured-cars',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './featured-cars.html',
  styleUrl: './featured-cars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedCars {

  private readonly carService = inject(CarService);

  private readonly router = inject(Router);

  readonly languageService = inject(LanguageService);


  // ============================================================
  // FEATURED CARS
  // ============================================================

  cars: Car[] = []

  constructor() {
    this.carService.getFeaturedCars().subscribe({
      next: (cars) => {
        console.log('Featured cars:', cars);
        console.log('First car:', cars[0]);
        console.log('Image:', cars[0]?.primaryImageUrl);
        console.log('Name EN:', cars[0]?.nameEn);
        console.log('Name AR:', cars[0]?.nameAr);
        console.log('Price:', cars[0]?.pricePerDay);

        this.cars = cars;
      },
      error: (error) => {
        console.error('Featured cars ERROR:', error);
      }
    });
  }
  // ============================================================
  // CURRENT LANGUAGE
  // ============================================================

  get currentLanguage(): string {
    return this.languageService.currentLanguage();
  }


  // ============================================================
  // CAR NAME
  // ============================================================

  getCarName(car: Car): string {

    return this.currentLanguage === 'ar'
      ? car.nameAr
      : car.nameEn;
  }


  // ============================================================
  // CAR CATEGORY
  // ============================================================

  getCategoryName(car: Car): string {

    return this.currentLanguage === 'ar'
      ? car.categoryNameAr
      : car.categoryNameEn;
  }


  // ============================================================
  // CAR DETAILS
  // ============================================================

  goToCarDetails(carId: number): void {

    this.router.navigate([
      '/cars',
      carId
    ]);
  }
}
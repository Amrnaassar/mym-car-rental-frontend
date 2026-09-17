import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { Car } from '../../../core/models/car.model';

import { CarService } from '../../../core/services/car.service';

import { LanguageService } from '../../../shared/services/language.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-cars',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    TranslatePipe
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

  cars=toSignal(
    this.carService.getFeaturedCars(),
    {
      initialValue: [] as Car[]
    }
  );

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
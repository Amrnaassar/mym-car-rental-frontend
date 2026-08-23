import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';

import { RentalPlan } from '../../../core/models/car.model';

import { CarCategoryService } from '../../../core/services/car-category';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hero {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly router = inject(Router);

  private readonly carCategoryService =
    inject(CarCategoryService);


    readonly fuelTypes = [
    'All',
    'Petrol',
    'Diesel',
    'Hybrid'
  ];

  // ============================================================
  // CATEGORIES
  // ============================================================

  readonly categories =
    this.carCategoryService.getCategories();


  // ============================================================
  // RENTAL PLAN
  // ============================================================

  readonly selectedPlan =
    signal<RentalPlan>('daily');


  // ============================================================
  // PLAN SELECTION
  // ============================================================

  selectPlan(plan: RentalPlan): void {
    this.selectedPlan.set(plan);
  }


  // ============================================================
  // EXPLORE CARS
  // ============================================================

  onExploreCars(): void {

    this.router.navigate(
      ['/cars'],
      {
        queryParams: {
          plan: this.selectedPlan()
        }
      }
    );

  }


  // ============================================================
  // SEARCH
  // ============================================================

  onSearchSubmit(event: Event): void {

    event.preventDefault();

    const form =
      event.target as HTMLFormElement;

    const formData =
      new FormData(form);


    // ----------------------------------------------------------
    // fuelType
    // ----------------------------------------------------------

    const fuelType =
      String(
        formData.get('fuelType') ?? 'all'
      );


    // ----------------------------------------------------------
    // CAR TYPE
    // ----------------------------------------------------------

    const category =
      String(
        formData.get('carType') ?? 'all'
      );


    // ----------------------------------------------------------
    // PRICE RANGE
    // ----------------------------------------------------------

    const priceRange =
      String(
        formData.get('priceRange') ?? 'all'
      );


    // ----------------------------------------------------------
    // TRANSMISSION
    // ----------------------------------------------------------

    const transmission =
      String(
        formData.get('transmission') ?? 'All'
      );


    // ----------------------------------------------------------
    // NAVIGATE TO CARS
    // ----------------------------------------------------------

    this.router.navigate(
      ['/cars'],
      {
        queryParams: {

          // Rental plan
          plan: this.selectedPlan(),

          // fuelType
          fuelType:
            fuelType !== 'all'
              ? fuelType
              : null,

          // Car category
          category:
            category !== 'all'
              ? category
              : null,

          // Maximum price
          maxPrice:
            priceRange !== 'all'
              ? priceRange
              : null,

          // Transmission
          transmission:
            transmission !== 'All'
              ? transmission
              : null

        }
      }
    );

  }

}
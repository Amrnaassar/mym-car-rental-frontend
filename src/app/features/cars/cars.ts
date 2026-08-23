import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import {
  Car,
  RentalPlan
} from '../../core/models/car.model';

import { CarCategoryService } from '../../core/services/car-category';
import { CarService } from '../../core/services/car-service';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cars {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly carService = inject(CarService);
  private readonly carCategoryService = inject(CarCategoryService);


  // ============================================================
  // DATA
  // ============================================================

  readonly cars = this.carService.getCars();

  readonly categories =
    this.carCategoryService.getCategories();


  // ============================================================
  // RENTAL PLAN
  // ============================================================

  readonly selectedPlan =
    signal<RentalPlan>('daily');


  // ============================================================
  // FILTER STATE
  // ============================================================

  readonly searchQuery =
    signal('');

  readonly selectedCategory =
    signal<number | null>(null);

  readonly selectedTransmission =
    signal('All');

  readonly selectedFuelType =
    signal('All');

  readonly maxPrice =
    signal(1200);

  readonly sortBy =
    signal('popular');

  readonly filtersOpen =
    signal(false);


  // ============================================================
  // FILTER OPTIONS
  // ============================================================

  readonly transmissions = [
    'All',
    'Automatic',
    'Manual'
  ];

  readonly fuelTypes = [
    'All',
    'Petrol',
    'Diesel',
    'Hybrid'
  ];


  // ============================================================
  // CURRENT PLAN MAX PRICE
  // ============================================================

  readonly currentPlanMaxPrice = computed(() =>
    this.getMaxPriceForPlan(this.selectedPlan())
  );


  // ============================================================
  // FILTERED CARS
  // ============================================================

  readonly filteredCars = computed(() => {

    const search =
      this.searchQuery()
        .trim()
        .toLowerCase();

    const categoryId =
      this.selectedCategory();

    const transmission =
      this.selectedTransmission();

    const fuelType =
      this.selectedFuelType();

    const maxPrice =
      this.maxPrice();

    const plan =
      this.selectedPlan();

    const sort =
      this.sortBy();


    let result = this.cars.filter(car => {

      // Search
      const matchesSearch =
        !search ||
        car.name
          .toLowerCase()
          .includes(search);


      // Category
      const matchesCategory =
        categoryId === null ||
        car.categoryId === categoryId;


      // Transmission
      const matchesTransmission =
        transmission === 'All' ||
        car.transmission === transmission;


      // Fuel
      const matchesFuel =
        fuelType === 'All' ||
        car.fuelType === fuelType;


      // Price
      const price =
        this.carService.getPrice(
          car,
          plan
        );

      const matchesPrice =
        price <= maxPrice;


      return (
        matchesSearch &&
        matchesCategory &&
        matchesTransmission &&
        matchesFuel &&
        matchesPrice
      );

    });


    // ==========================================================
    // SORTING
    // ==========================================================

    result = [...result];

    switch (sort) {

      case 'price-low':

        result.sort((a, b) =>
          this.carService.getPrice(a, plan) -
          this.carService.getPrice(b, plan)
        );

        break;


      case 'price-high':

        result.sort((a, b) =>
          this.carService.getPrice(b, plan) -
          this.carService.getPrice(a, plan)
        );

        break;


      case 'rating':

        result.sort(
          (a, b) => b.rating - a.rating
        );

        break;


      case 'name':

        result.sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );

        break;


      default:

        result.sort(
          (a, b) => b.rating - a.rating
        );

        break;
    }


    return result;

  });


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {
    this.loadSearchParams();
  }


  // ============================================================
  // LOAD HERO SEARCH PARAMETERS
  // ============================================================

  private loadSearchParams(): void {

    this.route.queryParams.subscribe(params => {

      // ----------------------------------------------------------
      // RENTAL PLAN
      // ----------------------------------------------------------

      const plan =
        params['plan'];

      if (
        plan === 'daily' ||
        plan === 'weekly' ||
        plan === 'monthly'
      ) {

        this.selectedPlan.set(plan);

      }

      // ----------------------------------------------------------
      // CATEGORY
      // ----------------------------------------------------------

      const category =
        Number(params['category']);

      if (
        Number.isInteger(category) &&
        category > 0
      ) {

        this.selectedCategory.set(category);

      } else {

        this.selectedCategory.set(null);

      }


      // ----------------------------------------------------------
      // TRANSMISSION
      // ----------------------------------------------------------

      const transmission =
        params['transmission'];

      if (
        transmission &&
        this.transmissions.includes(transmission)
      ) {

        this.selectedTransmission.set(
          transmission
        );

      } else {

        this.selectedTransmission.set('All');

      }


      // ----------------------------------------------------------
      // MAX PRICE
      // ----------------------------------------------------------

      const price =
        Number(params['maxPrice']);

      const planMaxPrice =
        this.getMaxPriceForPlan(
          this.selectedPlan()
        );


      if (
        Number.isFinite(price) &&
        price > 0
      ) {

        this.maxPrice.set(
          Math.min(
            price,
            planMaxPrice
          )
        );

      } else {

        this.maxPrice.set(
          planMaxPrice
        );

      }

       // ----------------------------------------------------------
      // Fuel type
      // ----------------------------------------------------------

      const fuelType =
        params['fuelType'];

      if (
        fuelType &&
        this.fuelTypes.includes(fuelType)
      ) {

        this.selectedFuelType.set(
          fuelType
        );

      } else {

        this.selectedFuelType.set('All');

      }

    });

  }


  // ============================================================
  // SELECTED CAR PRICE
  // ============================================================

  getCarPrice(car: Car): number {

    return this.carService.getPrice(
      car,
      this.selectedPlan()
    );

  }


  // ============================================================
  // PLAN LABEL
  // ============================================================

  getPlanLabel(): string {

    switch (this.selectedPlan()) {

      case 'weekly':
        return 'Week';

      case 'monthly':
        return 'Month';

      case 'daily':
      default:
        return 'Day';

    }

  }


  // ============================================================
  // CATEGORY NAME
  // ============================================================

  getCategoryName(
    categoryId: number | null
  ): string {

    if (categoryId === null) {
      return 'All';
    }

    const category =
      this.categories.find(
        item => item.id === categoryId
      );

    return category?.name ?? 'Unknown';

  }


  // ============================================================
  // PLAN SELECTION
  // ============================================================

  setPlan(plan: RentalPlan): void {

    this.selectedPlan.set(plan);

    this.maxPrice.set(
      this.getMaxPriceForPlan(plan)
    );

  }


  // ============================================================
  // MAX PRICE FOR PLAN
  // ============================================================

  getMaxPriceForPlan(
    plan: RentalPlan
  ): number {

    if (!this.cars.length) {
      return 0;
    }

    const prices =
      this.cars.map(car =>
        this.carService.getPrice(
          car,
          plan
        )
      );

    return Math.max(...prices);

  }


  // ============================================================
  // CATEGORY FILTER
  // ============================================================

  setCategory(
    categoryId: number | null
  ): void {

    this.selectedCategory.set(
      categoryId
    );

  }


  // ============================================================
  // TRANSMISSION FILTER
  // ============================================================

  setTransmission(
    transmission: string
  ): void {

    this.selectedTransmission.set(
      transmission
    );

  }


  // ============================================================
  // FUEL FILTER
  // ============================================================

  setFuelType(
    fuelType: string
  ): void {

    this.selectedFuelType.set(
      fuelType
    );

  }


  // ============================================================
  // PRICE FILTER
  // ============================================================

  setPrice(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.maxPrice.set(
      Number(input.value)
    );

  }


  // ============================================================
  // SEARCH FILTER
  // ============================================================

  setSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchQuery.set(
      input.value
    );

  }


  // ============================================================
  // SORT
  // ============================================================

  setSort(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    this.sortBy.set(
      select.value
    );

  }


  // ============================================================
  // MOBILE FILTERS
  // ============================================================

  toggleFilters(): void {

    this.filtersOpen.update(
      value => !value
    );

  }


  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  clearFilters(): void {

    this.searchQuery.set('');

    this.selectedCategory.set(null);

    this.selectedTransmission.set('All');

    this.selectedFuelType.set('All');

    this.maxPrice.set(
      this.currentPlanMaxPrice()
    );

    this.sortBy.set('popular');

  }


  // ============================================================
  // CAR DETAILS
  // ============================================================

  getCarDetails(id: number): void {

    this.router.navigate(
      ['/cars', id],
      {
        queryParams: {
          plan: this.selectedPlan()
        }
      }
    );

  }

}
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Car,
  FuelType,
  RentalPlan,
  Transmission
} from '../../core/models/car.model';


import {
  LanguageService
} from '../../core/services/language.service';
import { CarService } from '../../core/services/car.service';
import { CarCategoryService } from '../../core/services/car-category.service';
import { Category } from '../../core/models/car-category.model';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cars implements OnInit {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly carService =
    inject(CarService);

  private readonly carCategoryService =
    inject(CarCategoryService);

  readonly languageService =
    inject(LanguageService);


  // ============================================================
  // DATA
  // ============================================================

  readonly cars =
    signal<Car[]>([]);

  readonly categories =
    signal<Category[]>([]);

  readonly loading =
    signal(true);

  readonly error =
    signal(false);


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
    signal<Transmission | 'All'>('All');

  readonly selectedFuelType =
    signal<FuelType | 'All'>('All');

  readonly maxPrice =
    signal(0);

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

  readonly currentPlanMaxPrice =
    computed(() =>
      this.getMaxPriceForPlan(
        this.selectedPlan()
      )
    );


  // ============================================================
  // FILTERED CARS
  // ============================================================

  readonly filteredCars =
    computed(() => {

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


      let result =
        this.cars().filter(car => {

          // ------------------------------------------------------
          // Search
          // ------------------------------------------------------

          const matchesSearch =
            !search ||
            car.nameEn
              .toLowerCase()
              .includes(search) ||
            car.nameAr
              .toLowerCase()
              .includes(search);


          // ------------------------------------------------------
          // Category
          // ------------------------------------------------------

          const matchesCategory =
            categoryId === null ||
            car.categoryId === categoryId;


          // ------------------------------------------------------
          // Transmission
          // ------------------------------------------------------

          const matchesTransmission =
            transmission === 'All' ||
            car.transmission === transmission;


          // ------------------------------------------------------
          // Fuel
          // ------------------------------------------------------

          const matchesFuel =
            fuelType === 'All' ||
            car.fuelType === fuelType;


          // ------------------------------------------------------
          // Price
          // ------------------------------------------------------

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
          result.sort(
            (a, b) =>
              this.carService.getPrice(a, plan) -
              this.carService.getPrice(b, plan)
          );
          break;


        case 'price-high':
          result.sort(
            (a, b) =>
              this.carService.getPrice(b, plan) -
              this.carService.getPrice(a, plan)
          );
          break;


        case 'rating':
          result.sort(
            (a, b) =>
              b.rating - a.rating
          );
          break;


        case 'name':
          result.sort(
            (a, b) =>
              this.getCarName(a)
                .localeCompare(
                  this.getCarName(b)
                )
          );
          break;


        default:
          result.sort(
            (a, b) =>
              b.rating - a.rating
          );
          break;
      }


      return result;
    });


  // ============================================================
  // INITIALIZATION
  // ============================================================

  ngOnInit(): void {
    this.loadSearchParams();
    this.loadData();
  }


  // ============================================================
  // LOAD API DATA
  // ============================================================

  private loadData(): void {

    this.loading.set(true);
    this.error.set(false);

    this.carService
      .getAvailableCars()
      .subscribe({
        next: cars => {

          this.cars.set(
            cars.filter(
              car => car.isActive
            )
          );

          this.maxPrice.set(
            this.getMaxPriceForPlan(
              this.selectedPlan()
            )
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Failed to load cars:',
            error
          );

          this.error.set(true);
          this.loading.set(false);
        }
      });


    this.carCategoryService
      .getCategories()
      .subscribe({
        next: categories => {
          this.categories.set(
            categories
          );
        },

        error: error => {
          console.error(
            'Failed to load categories:',
            error
          );
        }
      });
  }


  // ============================================================
  // LOAD HERO SEARCH PARAMETERS
  // ============================================================

  private loadSearchParams(): void {

    this.route.queryParams
      .subscribe(params => {

        // --------------------------------------------------------
        // RENTAL PLAN
        // --------------------------------------------------------

        const plan =
          params['plan'];

        if (
          plan === 'daily' ||
          plan === 'weekly' ||
          plan === 'monthly'
        ) {
          this.selectedPlan.set(plan);
        }


        // --------------------------------------------------------
        // CATEGORY
        // --------------------------------------------------------

        const category =
          Number(params['category']);

        if (
          Number.isInteger(category) &&
          category > 0
        ) {
          this.selectedCategory.set(
            category
          );
        } else {
          this.selectedCategory.set(null);
        }


        // --------------------------------------------------------
        // TRANSMISSION
        // --------------------------------------------------------

        const transmission =
          params['transmission'];

        if (
          transmission === 'Automatic'
        ) {
          this.selectedTransmission.set(
            Transmission.Automatic
          );
        } else if (
          transmission === 'Manual'
        ) {
          this.selectedTransmission.set(
            Transmission.Manual
          );
        } else {
          this.selectedTransmission.set(
            'All'
          );
        }


        // --------------------------------------------------------
        // MAX PRICE
        // --------------------------------------------------------

        const price =
          Number(params['maxPrice']);

        if (
          Number.isFinite(price) &&
          price > 0
        ) {
          this.maxPrice.set(price);
        }


        // --------------------------------------------------------
        // FUEL TYPE
        // --------------------------------------------------------

        const fuelType =
          params['fuelType'];

        if (
          fuelType === 'Petrol'
        ) {
          this.selectedFuelType.set(
            FuelType.Petrol
          );
        } else if (
          fuelType === 'Diesel'
        ) {
          this.selectedFuelType.set(
            FuelType.Diesel
          );
        } else if (
          fuelType === 'Hybrid'
        ) {
          this.selectedFuelType.set(
            FuelType.Hybrid
          );
        } else {
          this.selectedFuelType.set(
            'All'
          );
        }
      });
  }


  // ============================================================
  // CAR NAME
  // ============================================================

  getCarName(car: Car): string {

    return this.languageService.isArabic()
      ? car.nameAr
      : car.nameEn;
  }


  // ============================================================
  // CAR DESCRIPTION
  // ============================================================

  getCarDescription(
    car: Car
  ): string {

    return this.languageService.isArabic()
      ? car.descriptionAr ?? ''
      : car.descriptionEn ?? '';
  }


  // ============================================================
  // CATEGORY NAME
  // ============================================================

  getCategoryName(
    categoryId: number | null
  ): string {

    if (categoryId === null) {
      return this.languageService.isArabic()
        ? 'الكل'
        : 'All';
    }

    const category =
      this.categories().find(
        item => item.id === categoryId
      );

    if (!category) {
      return this.languageService.isArabic()
        ? 'غير معروف'
        : 'Unknown';
    }

    return this.languageService.isArabic()
      ? category.nameAr
      : category.nameEn;
  }


  // ============================================================
  // TRANSMISSION LABEL
  // ============================================================

  getTransmissionLabel(
    transmission: Transmission
  ): string {

    const isArabic =
      this.languageService.isArabic();

    if (
      transmission === Transmission.Automatic
    ) {
      return isArabic
        ? 'أوتوماتيك'
        : 'Automatic';
    }

    return isArabic
      ? 'مانيوال'
      : 'Manual';
  }


  // ============================================================
  // FUEL LABEL
  // ============================================================

  getFuelTypeLabel(
    fuelType: FuelType
  ): string {

    const isArabic =
      this.languageService.isArabic();

    switch (fuelType) {

      case FuelType.Diesel:
        return isArabic
          ? 'ديزل'
          : 'Diesel';

      case FuelType.Hybrid:
        return isArabic
          ? 'هجين'
          : 'Hybrid';

      case FuelType.Petrol:
      default:
        return isArabic
          ? 'بنزين'
          : 'Petrol';
    }
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

    const isArabic =
      this.languageService.isArabic();

    switch (this.selectedPlan()) {

      case 'weekly':
        return isArabic
          ? 'أسبوع'
          : 'Week';

      case 'monthly':
        return isArabic
          ? 'شهر'
          : 'Month';

      case 'daily':
      default:
        return isArabic
          ? 'يوم'
          : 'Day';
    }
  }


  // ============================================================
  // PLAN SELECTION
  // ============================================================

  setPlan(
    plan: RentalPlan
  ): void {

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

    const cars =
      this.cars();

    if (!cars.length) {
      return 0;
    }

    const prices =
      cars.map(car =>
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

    if (
      transmission === 'Automatic'
    ) {
      this.selectedTransmission.set(
        Transmission.Automatic
      );
      return;
    }

    if (
      transmission === 'Manual'
    ) {
      this.selectedTransmission.set(
        Transmission.Manual
      );
      return;
    }

    this.selectedTransmission.set(
      'All'
    );
  }


  // ============================================================
  // FUEL FILTER
  // ============================================================

  setFuelType(
    fuelType: string
  ): void {

    if (
      fuelType === 'Petrol'
    ) {
      this.selectedFuelType.set(
        FuelType.Petrol
      );
      return;
    }

    if (
      fuelType === 'Diesel'
    ) {
      this.selectedFuelType.set(
        FuelType.Diesel
      );
      return;
    }

    if (
      fuelType === 'Hybrid'
    ) {
      this.selectedFuelType.set(
        FuelType.Hybrid
      );
      return;
    }

    this.selectedFuelType.set(
      'All'
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

    this.selectedCategory.set(
      null
    );

    this.selectedTransmission.set(
      'All'
    );

    this.selectedFuelType.set(
      'All'
    );

    this.maxPrice.set(
      this.currentPlanMaxPrice()
    );

    this.sortBy.set(
      'popular'
    );
  }


  // ============================================================
  // RETRY
  // ============================================================

  retry(): void {
    this.loadData();
  }


  // ============================================================
  // CAR DETAILS
  // ============================================================

  getCarDetails(
    id: number
  ): void {

    this.router.navigate(
      ['/cars', id],
      {
        queryParams: {
          plan: this.selectedPlan()
        }
      }
    );
  }


  // ============================================================
  // BOOK NOW
  // ============================================================

  bookNow(
    carId: number
  ): void {

    this.router.navigate(
      ['/booking'],
      {
        queryParams: {
          car: carId,
          plan: this.selectedPlan()
        }
      }
    );
  }
}
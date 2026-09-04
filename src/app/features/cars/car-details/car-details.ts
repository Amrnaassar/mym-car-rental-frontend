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
  Router,
  RouterLink
} from '@angular/router';

import {
  Car,
  FuelType,
  RentalPlan,
  Transmission
} from '../../../core/models/car.model';

import { CarService } from '../../../core/services/car.service';

import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePickerComponent
  ],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarDetails {

  // ============================================================
  // DEPENDENCIES
  // ============================================================

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly carService = inject(CarService);


  // ============================================================
  // CAR ID
  // ============================================================

  readonly carId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id'))
  );


  // ============================================================
  // CAR DATA
  // ============================================================

  readonly car = signal<Car | null>(null);

  readonly isLoading = signal(true);

  readonly hasError = signal(false);


  // ============================================================
  // BOOKING DATA
  // ============================================================

  readonly pickupDate = signal<string>('');

  readonly returnDate = signal<string>('');

  readonly pickupLocation = signal<string>('');


  // ============================================================
  // RENTAL PLAN
  // ============================================================

  readonly selectedPlan = signal<RentalPlan>('daily');


  // ============================================================
  // INSURANCE
  // ============================================================

  readonly insurancePrice = 1000;


  // ============================================================
  // CURRENT PRICE
  // ============================================================

  readonly currentPrice = computed<number>(() => {

    const currentCar = this.car();

    if (!currentCar) {
      return 0;
    }

    switch (this.selectedPlan()) {

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

    switch (this.selectedPlan()) {

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
  // RENTAL DAYS
  // ============================================================

  readonly rentalDays = computed<number>(() => {

    const pickup = this.parseDate(
      this.pickupDate()
    );

    const returnDate = this.parseDate(
      this.returnDate()
    );

    if (!pickup || !returnDate) {
      return 0;
    }

    const difference =
      returnDate.getTime() -
      pickup.getTime();

    const days = Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

    return Math.max(days, 0);
  });


  // ============================================================
  // CALCULATED PLAN
  // ============================================================

  readonly calculatedPlan =
    computed<RentalPlan>(() => {

      const days = this.rentalDays();

      if (days < 7) {
        return 'daily';
      }

      if (days < 30) {
        return 'weekly';
      }

      return 'monthly';
    });


  // ============================================================
  // ACTIVE RATE
  // ============================================================

  readonly activeRate = computed<number>(() => {

    const currentCar = this.car();

    if (!currentCar) {
      return 0;
    }

    const days = this.rentalDays();

    if (days < 7) {
      return currentCar.pricePerDay;
    }

    if (days < 30) {
      return currentCar.pricePerWeek;
    }

    return currentCar.pricePerMonth;
  });


  // ============================================================
  // ACTIVE RATE LABEL
  // ============================================================

  readonly activeRateLabel = computed<string>(() => {

    const days = this.rentalDays();

    if (days < 7) {
      return 'Day Rate';
    }

    if (days < 30) {
      return 'Weekly Rate';
    }

    return 'Monthly Rate';
  });


  // ============================================================
  // EFFECTIVE DAILY RATE
  // ============================================================

  readonly effectiveDailyRate =
    computed<number>(() => {

      const currentCar = this.car();

      if (!currentCar) {
        return 0;
      }

      const days = this.rentalDays();

      if (days < 7) {
        return currentCar.pricePerDay;
      }

      if (days < 30) {
        return currentCar.pricePerWeek / 7;
      }

      return currentCar.pricePerMonth / 30;
    });


  // ============================================================
  // RENTAL TOTAL
  // ============================================================

  readonly totalPrice = computed<number>(() => {

    const days = this.rentalDays();

    const rate = this.effectiveDailyRate();

    if (days <= 0 || rate <= 0) {
      return 0;
    }

    return days * rate;
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
  // GALLERY
  // ============================================================

  readonly selectedImage = signal<string>('');

  readonly galleryImages = computed<string[]>(() => {

    const currentCar = this.car();

    if (!currentCar) {
      return [];
    }

    return currentCar.images
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder
      )
      .map(image => image.imageUrl)
      .filter(
        (image, index, images) =>
          !!image &&
          images.indexOf(image) === index
      );
  });


  // ============================================================
  // FEATURES
  // ============================================================

  readonly features = [
    'Premium leather seats',
    'Advanced safety features',
    'Parking sensors',
    'Sunroof',
    'Bluetooth connectivity',
    '360° camera'
  ];


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {

    this.loadRentalPlan();

    this.loadCar();
  }


  // ============================================================
  // LOAD CAR FROM API
  // ============================================================

  private loadCar(): void {

    const id = this.carId();

    if (!id || id <= 0) {

      this.isLoading.set(false);
      this.hasError.set(true);

      return;
    }

    this.isLoading.set(true);
    this.hasError.set(false);

    this.carService
      .getCarById(id)
      .subscribe({

        next: (car) => {

          this.car.set(car);

          const primaryImage =
            car.primaryImageUrl ??
            car.images
              .find(image => image.isPrimary)
              ?.imageUrl ??
            car.images[0]?.imageUrl ??
            '';

          this.selectedImage.set(
            primaryImage
          );

          this.isLoading.set(false);
        },

        error: () => {

          this.car.set(null);

          this.selectedImage.set('');

          this.isLoading.set(false);

          this.hasError.set(true);
        }
      });
  }


  // ============================================================
  // LOAD PLAN FROM URL
  // ============================================================

  private loadRentalPlan(): void {

    this.route.queryParams.subscribe(params => {

      const plan = params['plan'];

      if (
        plan === 'daily' ||
        plan === 'weekly' ||
        plan === 'monthly'
      ) {

        this.selectedPlan.set(plan);

      } else {

        this.selectedPlan.set('daily');
      }
    });
  }


  // ============================================================
  // CAR NAME
  // ============================================================

  getCarName(car: Car): string {

    // هنربطها بالـ LanguageService بعدين
    // حالياً English هو الـ default

    return car.nameEn;
  }


  // ============================================================
  // CAR DESCRIPTION
  // ============================================================

  getCarDescription(car: Car): string {

    return car.descriptionEn ?? '';
  }


  // ============================================================
  // TRANSMISSION LABEL
  // ============================================================

  getTransmissionLabel(
    transmission: Transmission
  ): string {

    switch (transmission) {

      case Transmission.Automatic:
        return 'Automatic';

      case Transmission.Manual:
        return 'Manual';

      default:
        return 'Unknown';
    }
  }


  // ============================================================
  // FUEL TYPE LABEL
  // ============================================================

  getFuelTypeLabel(
    fuelType: FuelType
  ): string {

    switch (fuelType) {

      case FuelType.Petrol:
        return 'Petrol';

      case FuelType.Diesel:
        return 'Diesel';

      case FuelType.Hybrid:
        return 'Hybrid';

      default:
        return 'Unknown';
    }
  }


  // ============================================================
  // DATE CHANGES
  // ============================================================

  setPickupDate(value: string): void {

    this.pickupDate.set(value);
  }


  setReturnDate(value: string): void {

    this.returnDate.set(value);
  }


  // ============================================================
  // LOCATION
  // ============================================================

  setPickupLocation(value: string): void {

    this.pickupLocation.set(value);
  }


  // ============================================================
  // PLAN SELECTION
  // ============================================================

  setPlan(plan: RentalPlan): void {

    this.selectedPlan.set(plan);
  }


  // ============================================================
  // IMAGE SELECTION
  // ============================================================

  selectImage(image: string): void {

    this.selectedImage.set(image);
  }


  // ============================================================
  // BOOK NOW
  // ============================================================

  bookNow(): void {

    const currentCar = this.car();

    if (!currentCar) {
      return;
    }

    if (
      !this.pickupDate() ||
      !this.returnDate() ||
      !this.pickupLocation()
    ) {
      return;
    }

    const days = this.rentalDays();

    if (days <= 0) {
      return;
    }

    this.router.navigate(
      ['/booking'],
      {
        queryParams: {

          car: currentCar.id,

          pickupDate:
            this.pickupDate(),

          returnDate:
            this.returnDate(),

          location:
            this.pickupLocation(),

          plan:
            this.selectedPlan()
        }
      }
    );
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

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }
}
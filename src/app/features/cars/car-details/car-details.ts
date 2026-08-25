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
  RentalPlan
} from '../../../core/models/car.model';

import { CarService } from '../../../core/services/car-service';
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
  // BOOKING DATA
  // ============================================================

  readonly pickupDate = signal<string>('');
  readonly returnDate = signal<string>('');
  readonly pickupLocation = signal<string>('');


  // ============================================================
  // CAR ID
  // ============================================================

  readonly carId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')) || 1
  );


  // ============================================================
  // CURRENT CAR
  // ============================================================

  readonly car = computed<Car | undefined>(() => {
    return this.carService.getCarById(this.carId());
  });


  // ============================================================
  // SELECTED RENTAL PLAN
  // Daily / Weekly / Monthly
  // ============================================================

  readonly selectedPlan = signal<RentalPlan>('daily');


  // ============================================================
  // DISPLAY PRICE
  // This is controlled by Daily / Weekly / Monthly buttons
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
  // DISPLAY PLAN LABEL
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

    const pickup = this.parseDate(this.pickupDate());
    const returnDate = this.parseDate(this.returnDate());

    if (!pickup || !returnDate) {
      return 0;
    }

    const difference =
      returnDate.getTime() - pickup.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return Math.max(days, 0);
  });


  // ============================================================
  // INSURANCE
  // ============================================================

  readonly insurancePrice = 1000;


  // ============================================================
  // AUTOMATIC PLAN BASED ON DATES
  //
  // This does NOT remove the manual plan buttons.
  // It is only used for calculating the rental total.
  // ============================================================

  readonly calculatedPlan = computed<RentalPlan>(() => {

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
  //
  // Shows the rate used by the dates
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
  //
  // Used for calculating the total for partial weeks/months.
  //
  // Example:
  // 10 days
  // weekly price = 3500
  //
  // 10 × (3500 / 7)
  // ============================================================

  readonly effectiveDailyRate = computed<number>(() => {

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
  // Rental + Insurance
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

    const images = [
      currentCar.image,
      ...this.getGalleryImages(currentCar)
    ];

    return images.filter(
      (image, index) =>
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

    const currentCar = this.car();

    if (currentCar) {
      this.selectedImage.set(currentCar.image);
    }
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
    !this.pickupDate ||
    !this.returnDate ||
    !this.pickupLocation
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
        pickupDate: this.pickupDate(),
        returnDate: this.returnDate(),
        location: this.pickupLocation(),
        plan: this.selectedPlan()
      }
    }
  );

}


  // ============================================================
  // DATE PARSER
  // ============================================================

  private parseDate(value: string): Date | null {

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


  // ============================================================
  // GALLERY IMAGES
  // ============================================================

  private getGalleryImages(car: Car): string[] {

    const basePath = 'assets/images/cars';

    const galleryMap: Record<number, string[]> = {

      1: [
        `${basePath}/mercedes-s-class-2.jpg`,
        `${basePath}/mercedes-s-class-3.jpg`,
        `${basePath}/mercedes-s-class-4.jpg`
      ],

      2: [
        `${basePath}/bmw-7-series-2.jpg`,
        `${basePath}/bmw-7-series-3.jpg`,
        `${basePath}/bmw-7-series-4.jpg`
      ],

      3: [
        `${basePath}/range-rover-vogue-2.jpg`,
        `${basePath}/range-rover-vogue-3.jpg`,
        `${basePath}/range-rover-vogue-4.jpg`
      ],

      4: [
        `${basePath}/porsche-911-2.jpg`,
        `${basePath}/porsche-911-3.jpg`,
        `${basePath}/porsche-911-4.jpg`
      ],

      5: [
        `${basePath}/audi-r8-2.jpg`,
        `${basePath}/audi-r8-3.jpg`,
        `${basePath}/audi-r8-4.jpg`
      ],

      6: [
        `${basePath}/lamborghini-huracan-2.jpg`,
        `${basePath}/lamborghini-huracan-3.jpg`,
        `${basePath}/lamborghini-huracan-4.jpg`
      ],

      7: [
        `${basePath}/mercedes-e-class-2.jpg`,
        `${basePath}/mercedes-e-class-3.jpg`,
        `${basePath}/mercedes-e-class-4.jpg`
      ],

      8: [
        `${basePath}/bmw-x5-2.jpg`,
        `${basePath}/bmw-x5-3.jpg`,
        `${basePath}/bmw-x5-4.jpg`
      ]
    };

    return galleryMap[car.id] ?? [];
  }
}
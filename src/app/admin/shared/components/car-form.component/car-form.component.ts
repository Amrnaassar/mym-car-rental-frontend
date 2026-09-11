import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Category } from '../../../../core/models/car-category.model';

import {
  Car,
  CarImage,
  FuelType,
  Transmission
} from '../../../../core/models/car.model';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss'
})
export class CarFormComponent implements OnChanges {

  private readonly fb = inject(FormBuilder);

  @Input() categories: Category[] = [];

  @Input() car: Car | null = null;

  @Input() submitLabel = 'Save Car';

  @Input() loading = false;

  @Output() submitted =
    new EventEmitter<FormData>();

  @Output() cancelled =
    new EventEmitter<void>();

  @Output() deleteImage =
    new EventEmitter<CarImage>();

  @Output() setPrimaryImage =
    new EventEmitter<CarImage>();

  readonly imagePreviews =
    signal<string[]>([]);

  readonly transmissionOptions = [
    {
      value: Transmission.Automatic,
      label: 'Automatic'
    },
    {
      value: Transmission.Manual,
      label: 'Manual'
    }
  ];

  readonly fuelOptions = [
    {
      value: FuelType.Petrol,
      label: 'Petrol'
    },
    {
      value: FuelType.Diesel,
      label: 'Diesel'
    },
    {
      value: FuelType.Hybrid,
      label: 'Hybrid'
    }
  ];

  private selectedImages: File[] = [];

  /*
   * Dynamic vehicle features.
   *
   * Each feature contains:
   * - FeatureAr
   * - FeatureEn
   */
  readonly features = signal<
    Array<{
      featureAr: string;
      featureEn: string;
    }>
  >([]);

  readonly form =
    this.fb.nonNullable.group({

      categoryId: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      nameAr: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      nameEn: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      descriptionAr: [
        '',
        Validators.maxLength(1000)
      ],

      descriptionEn: [
        '',
        Validators.maxLength(1000)
      ],

      pricePerDay: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      pricePerWeek: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      pricePerMonth: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      transmission: [
        Transmission.Automatic,
        Validators.required
      ],

      fuelType: [
        FuelType.Petrol,
        Validators.required
      ],

      seats: [
        4,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(20)
        ]
      ],

      doors: [
        4,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10)
        ]
      ],

      luggage: [
        2,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(20)
        ]
      ],

      isActive: [true],

      isFeatured: [false]
    });

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['car'] &&
      this.car
    ) {
      this.patchCar(this.car);
    }
  }

  private patchCar(car: Car): void {

    this.form.patchValue({

      categoryId:
        car.categoryId,

      nameAr:
        car.nameAr,

      nameEn:
        car.nameEn,

      descriptionAr:
        car.descriptionAr ?? '',

      descriptionEn:
        car.descriptionEn ?? '',

      pricePerDay:
        car.pricePerDay,

      pricePerWeek:
        car.pricePerWeek,

      pricePerMonth:
        car.pricePerMonth,

      transmission:
        car.transmission,

      fuelType:
        car.fuelType,

      seats:
        car.seats,

      doors:
        car.doors,

      luggage:
        car.luggage,

      isActive:
        car.isActive,

      isFeatured:
        car.isFeatured
    });

    /*
     * Load existing features when editing.
     *
     * If the car has no features,
     * start with one empty feature to make
     * adding the first feature easier.
     */
    if (car.features?.length) {

      this.features.set(
        car.features.map(feature => ({
          featureAr: feature.featureAr,
          featureEn: feature.featureEn
        }))
      );

    } else {

      this.features.set([]);

    }
  }

  addFeature(): void {

    this.features.update(features => [
      ...features,
      {
        featureAr: '',
        featureEn: ''
      }
    ]);
  }

  removeFeature(index: number): void {

    this.features.update(features =>
      features.filter(
        (_, featureIndex) =>
          featureIndex !== index
      )
    );
  }

  updateFeature(
    index: number,
    language: 'ar' | 'en',
    value: string
  ): void {

    this.features.update(features => {

      const updated = [...features];

      if (language === 'ar') {
        updated[index] = {
          ...updated[index],
          featureAr: value
        };
      } else {
        updated[index] = {
          ...updated[index],
          featureEn: value
        };
      }

      return updated;
    });
  }

  onImagesSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedImages =
      Array.from(input.files);

    const previews =
      this.selectedImages.map(
        file =>
          URL.createObjectURL(file)
      );

    this.imagePreviews.set(
      previews
    );
  }

  removeNewImage(
    index: number
  ): void {

    this.selectedImages.splice(
      index,
      1
    );

    const current =
      this.imagePreviews();

    const preview =
      current[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    current.splice(
      index,
      1
    );

    this.imagePreviews.set([
      ...current
    ]);
  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    /*
     * Validate features before sending.
     *
     * Empty features are ignored.
     * A feature is only sent when both
     * Arabic and English values exist.
     */
    const validFeatures =
      this.features()
        .map(feature => ({
          featureAr:
            feature.featureAr.trim(),

          featureEn:
            feature.featureEn.trim()
        }))
        .filter(
          feature =>
            feature.featureAr.length > 0 &&
            feature.featureEn.length > 0
        );

    /*
     * If the user entered only one language
     * for a feature, don't silently send it.
     */
    const hasIncompleteFeature =
      this.features().some(feature => {

        const ar =
          feature.featureAr.trim();

        const en =
          feature.featureEn.trim();

        return (
          (ar.length > 0 && en.length === 0) ||
          (ar.length === 0 && en.length > 0)
        );
      });

    if (hasIncompleteFeature) {
      return;
    }

    const formData =
      new FormData();

    formData.append(
      'categoryId',
      String(
        this.form.controls.categoryId.value
      )
    );

    formData.append(
      'nameAr',
      this.form.controls.nameAr.value.trim()
    );

    formData.append(
      'nameEn',
      this.form.controls.nameEn.value.trim()
    );

    formData.append(
      'descriptionAr',
      this.form.controls.descriptionAr.value.trim()
    );

    formData.append(
      'descriptionEn',
      this.form.controls.descriptionEn.value.trim()
    );

    formData.append(
      'pricePerDay',
      String(
        this.form.controls.pricePerDay.value
      )
    );

    formData.append(
      'pricePerWeek',
      String(
        this.form.controls.pricePerWeek.value
      )
    );

    formData.append(
      'pricePerMonth',
      String(
        this.form.controls.pricePerMonth.value
      )
    );

    formData.append(
      'transmission',
      String(
        this.form.controls.transmission.value
      )
    );

    formData.append(
      'fuelType',
      String(
        this.form.controls.fuelType.value
      )
    );

    formData.append(
      'seats',
      String(
        this.form.controls.seats.value
      )
    );

    formData.append(
      'doors',
      String(
        this.form.controls.doors.value
      )
    );

    formData.append(
      'luggage',
      String(
        this.form.controls.luggage.value
      )
    );

    formData.append(
      'isFeatured',
      String(
        this.form.controls.isFeatured.value
      )
    );

    if (this.car) {

      formData.append(
        'isActive',
        String(
          this.form.controls.isActive.value
        )
      );
    }

    /*
     * Append features using ASP.NET Core
     * multipart/form-data collection binding.
     *
     * Example:
     *
     * Features[0].FeatureAr
     * Features[0].FeatureEn
     * Features[1].FeatureAr
     * Features[1].FeatureEn
     */
    validFeatures.forEach(
      (feature, index) => {

        formData.append(
          `Features[${index}].FeatureAr`,
          feature.featureAr
        );

        formData.append(
          `Features[${index}].FeatureEn`,
          feature.featureEn
        );
      }
    );

    /*
     * Images
     */
    for (
      const image of this.selectedImages
    ) {

      formData.append(
        'images',
        image,
        image.name
      );
    }

    this.submitted.emit(
      formData
    );
  }

  cancel(): void {
    this.cancelled.emit();
  }

  existingImages(): CarImage[] {
    return this.car?.images ?? [];
  }
}
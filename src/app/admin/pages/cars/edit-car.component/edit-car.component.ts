import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../../core/models/car-category.model';
import { Car, CarImage } from '../../../../core/models/car.model';
import { AdminCarsService } from '../../../core/services/admin-cars';
import { AdminCategoriesService } from '../../../core/services/admin-categories';
import { CarFormComponent } from '../../../shared/components/car-form.component/car-form.component';
import { AlertService } from '../../../../shared/services/alert.service';


@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [
    CarFormComponent
  ],
  templateUrl: './edit-car.component.html',
  styleUrl: './edit-car.component.scss'
})
export class EditCarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly carsService = inject(AdminCarsService);

  private readonly categoriesService = inject(AdminCategoriesService);

  private readonly alertService = inject(AlertService);

  readonly car = signal<Car | null>(null);

  readonly categories = signal<Category[]>([]);

  readonly loading = signal(false);

  readonly pageLoading = signal(true);

  readonly deletingImage = signal(false);

  readonly errorMessage = signal<string | null>(null);

  private carId = 0;

  ngOnInit(): void {
    this.carId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.carId) {
      this.router.navigate([
        '/admin/cars'
      ]);

      return;
    }

    this.loadData();
  }

  private loadData(): void {
    this.pageLoading.set(true);

    this.categoriesService
      .getAll()
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.loadCar();
        },

        error: (error) => {
          console.error(
            'Failed to load categories:',
            error
          );

          this.pageLoading.set(false);

          this.errorMessage.set(
            'Failed to load categories.'
          );

          this.alertService.error(
            'Unable to Load Categories',
            'Please try again later.'
          );
        }
      });
  }

  private loadCar(): void {
    this.carsService
      .getById(this.carId)
      .subscribe({
        next: (car) => {
          this.car.set(car);
          this.pageLoading.set(false);
        },

        error: (error) => {
          console.error(
            'Failed to load car:',
            error
          );

          this.pageLoading.set(false);

          this.alertService.error(
            'Unable to Load Car',
            'The requested car could not be loaded.'
          );

          this.router.navigate([
            '/admin/cars'
          ]);
        }
      });
  }

  updateCar(formData: FormData): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.carsService
      .update(
        this.carId,
        formData
      )
      .subscribe({
        next: (car) => {
          this.car.set(car);
          this.loading.set(false);

          this.alertService.success(
            'Car Updated',
            'The car has been updated successfully.'
          );

          this.router.navigate([
            '/admin/cars'
          ]);
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to update car:',
            error
          );

          this.loading.set(false);

          const message =
            error.error?.message ??
            'Failed to update the car.';

          this.errorMessage.set(message);

          this.alertService.error(
            'Update Failed',
            message
          );
        }
      });
  }

  removeImage(image: CarImage): void {
    const confirmed = window.confirm(
      'Delete this image?'
    );

    if (!confirmed) {
      return;
    }

    this.deletingImage.set(true);

    this.carsService
      .deleteImage(
        this.carId,
        image.id
      )
      .subscribe({
        next: () => {
          this.deletingImage.set(false);

          this.alertService.success(
            'Image Deleted',
            'The image has been deleted successfully.'
          );

          this.loadCar();
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to delete image:',
            error
          );

          this.deletingImage.set(false);

          const message =
            error.error?.message ??
            'Failed to delete the image.';

          this.errorMessage.set(message);

          this.alertService.error(
            'Delete Failed',
            message
          );
        }
      });
  }

  makePrimary(image: CarImage): void {
    this.carsService
      .setPrimaryImage(
        this.carId,
        image.id
      )
      .subscribe({
        next: () => {
          this.alertService.success(
            'Primary Image Updated',
            'The primary image has been updated successfully.'
          );

          this.loadCar();
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to set primary image:',
            error
          );

          const message =
            error.error?.message ??
            'Failed to set the primary image.';

          this.errorMessage.set(message);

          this.alertService.error(
            'Update Failed',
            message
          );
        }
      });
  }

  cancel(): void {
    this.router.navigate([
      '/admin/cars'
    ]);
  }
}
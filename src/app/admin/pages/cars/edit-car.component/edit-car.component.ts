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
  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly carsService =
    inject(AdminCarsService);

  private readonly categoriesService =
    inject(AdminCategoriesService);

  readonly car =
    signal<Car | null>(null);

  readonly categories =
    signal<Category[]>([]);

  readonly loading =
    signal(false);

  readonly pageLoading =
    signal(true);

  readonly deletingImage =
    signal(false);

  readonly errorMessage =
    signal<string | null>(null);

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
        next: categories => {
          this.categories.set(
            categories
          );

          this.loadCar();
        },

        error: () => {
          this.pageLoading.set(false);

          this.errorMessage.set(
            'Failed to load categories.'
          );
        }
      });
  }

  private loadCar(): void {
    this.carsService
      .getById(this.carId)
      .subscribe({
        next: car => {
          this.car.set(car);
          this.pageLoading.set(false);
        },

        error: () => {
          this.pageLoading.set(false);

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
        next: car => {
          this.car.set(car);
          this.loading.set(false);

          this.router.navigate([
            '/admin/cars'
          ]);
        },

        error: (error: HttpErrorResponse) => {
          this.loading.set(false);

          this.errorMessage.set(
            error.error?.message ??
            'Failed to update the car.'
          );
        }
      });
  }

  removeImage(image: CarImage): void {
    const confirmed =
      window.confirm(
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

          this.loadCar();
        },

        error: (error: HttpErrorResponse) => {
          this.deletingImage.set(false);

          this.errorMessage.set(
            error.error?.message ??
            'Failed to delete the image.'
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
          this.loadCar();
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(
            error.error?.message ??
            'Failed to set the primary image.'
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
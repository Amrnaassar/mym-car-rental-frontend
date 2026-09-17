import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';
import { Category } from '../../../../core/models/car-category.model';
import { AdminCarsService } from '../../../core/services/admin-cars';
import { AdminCategoriesService } from '../../../core/services/admin-categories';
import { CarFormComponent } from '../../../shared/components/car-form.component/car-form.component';
import { AlertService } from '../../../../shared/services/alert.service';



@Component({
  selector: 'app-create-car',
  standalone: true,
  imports: [
    CarFormComponent
  ],
  templateUrl: './create-car.component.html',
  styleUrl: './create-car.component.scss'
})
export class CreateCarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly carsService = inject(AdminCarsService);
  private readonly categoriesService = inject(AdminCategoriesService);
  private readonly alertService = inject(AlertService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly categoriesLoading = signal(true);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesLoading.set(true);

    this.categoriesService
      .getAll()
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.categoriesLoading.set(false);
        },

        error: (error) => {
          console.error(
            'Failed to load categories:',
            error
          );

          this.categoriesLoading.set(false);

          this.alertService.error(
            'Unable to Load Categories',
            'Please try again later.'
          );
        }
      });
  }

  createCar(formData: FormData): void {
    this.loading.set(true);

    this.carsService
      .create(formData)
      .subscribe({
        next: () => {
          this.loading.set(false);

          this.alertService.success(
            'Car Created',
            'The car has been created successfully.'
          );

          this.router.navigate([
            '/admin/cars'
          ]);
        },

        error: (error) => {
          console.error(
            'Failed to create car:',
            error
          );

          this.loading.set(false);

          this.alertService.error(
            'Creation Failed',
            'Unable to create the car. Please try again.'
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
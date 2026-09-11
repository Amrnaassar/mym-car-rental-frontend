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

  private readonly carsService =
    inject(AdminCarsService);

  private readonly categoriesService =
    inject(AdminCategoriesService);

  readonly categories =
    signal<Category[]>([]);

  readonly loading =
    signal(false);

  readonly categoriesLoading =
    signal(true);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesLoading.set(true);

    this.categoriesService
      .getAll()
      .subscribe({
        next: categories => {
          this.categories.set(categories);
          this.categoriesLoading.set(false);
        },

        error: () => {
          this.categoriesLoading.set(false);
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

          this.router.navigate([
            '/admin/cars'
          ]);
        },

        error: () => {
          this.loading.set(false);
        }
      });
  }

  cancel(): void {
    this.router.navigate([
      '/admin/cars'
    ]);
  }
}
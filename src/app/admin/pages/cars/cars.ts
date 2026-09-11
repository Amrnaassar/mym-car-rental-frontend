import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  Car,
  FuelType,
  Transmission
} from '../../../core/models/car.model';
import { AdminCarsService } from '../../core/services/admin-cars';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './cars.html',
  styleUrl: './cars.scss'
})
export class Cars implements OnInit {
  private readonly carsService =
    inject(AdminCarsService);

  private readonly router =
    inject(Router);

  readonly cars =
    signal<Car[]>([]);

  readonly loading =
    signal(true);

  readonly search =
    signal('');

  readonly filterStatus =
    signal<'all' | 'active' | 'inactive'>('all');

  readonly filterFeatured =
    signal<'all' | 'featured' | 'regular'>('all');

  readonly filteredCars =
    computed(() => {
      const query =
        this.search()
          .trim()
          .toLowerCase();

      const status =
        this.filterStatus();

      const featured =
        this.filterFeatured();

      return this.cars().filter(car => {

        const matchesSearch =
          !query ||
          car.nameEn
            .toLowerCase()
            .includes(query) ||
          car.nameAr
            .toLowerCase()
            .includes(query) ||
          car.categoryNameEn
            .toLowerCase()
            .includes(query) ||
          car.categoryNameAr
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          status === 'all' ||
          (status === 'active'
            ? car.isActive
            : !car.isActive);

        const matchesFeatured =
          featured === 'all' ||
          (featured === 'featured'
            ? car.isFeatured
            : !car.isFeatured);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesFeatured
        );
      });
    });

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.loading.set(true);

    this.carsService
      .getAll()
      .subscribe({
        next: cars => {
          this.cars.set(cars);
          this.loading.set(false);
        },

        error: () => {
          this.loading.set(false);
        }
      });
  }

  createCar(): void {
    this.router.navigate([
      '/admin/cars/create'
    ]);
  }

  editCar(id: number): void {
    this.router.navigate([
      '/admin/cars/edit',
      id
    ]);
  }

  deleteCar(car: Car): void {
    const confirmed =
      window.confirm(
        `Delete "${car.nameEn}"?`
      );

    if (!confirmed) {
      return;
    }

    this.carsService
      .delete(car.id)
      .subscribe({
        next: () => {
          this.cars.update(
            current =>
              current.filter(
                item => item.id !== car.id
              )
          );
        },

        error: () => {
          // Keep current data if deletion fails.
        }
      });
  }

  transmissionLabel(
    transmission: Transmission
  ): string {
    return transmission ===
      Transmission.Automatic
      ? 'Automatic'
      : 'Manual';
  }

  fuelLabel(
    fuelType: FuelType
  ): string {
    switch (fuelType) {
      case FuelType.Diesel:
        return 'Diesel';

      case FuelType.Hybrid:
        return 'Hybrid';

      default:
        return 'Petrol';
    }
  }
}
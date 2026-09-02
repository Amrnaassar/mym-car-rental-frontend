import { Component, inject } from '@angular/core';
import { CarService } from '../../../core/services/car-service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-cars',
  imports: [CurrencyPipe],
  templateUrl: './featured-cars.html',
  styleUrl: './featured-cars.scss',
})
export class FeaturedCars {
  private readonly carService = inject(CarService);
  readonly cars = this.carService.getFeaturedCars();
  router = inject(Router);

  goToCarDetails(carId: number): void {
    this.router.navigate(['/cars', carId]);
  }

}

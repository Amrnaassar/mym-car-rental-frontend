import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Car,
  RentalPlan
} from '../models/car.model';

import {
  environment
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/cars`;

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(
      this.apiUrl
    );
  }

  getAvailableCars(): Observable<Car[]> {
    return this.getCars();
  }

  getFeaturedCars(): Observable<Car[]> {
    return this.http.get<Car[]>(
      `${this.apiUrl}/featured`
    );
  }

  getCarById(
    id: number
  ): Observable<Car> {
    return this.http.get<Car>(
      `${this.apiUrl}/${id}`
    );
  }

  getPrice(
    car: Car,
    plan: RentalPlan
  ): number {
    switch (plan) {
      case 'weekly':
        return Number(car.pricePerWeek);

      case 'monthly':
        return Number(car.pricePerMonth);

      case 'daily':
      default:
        return Number(car.pricePerDay);
    }
  }
}
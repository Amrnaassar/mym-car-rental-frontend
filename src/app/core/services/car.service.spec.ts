import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient
} from '@angular/common/http';
import {
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { CarService } from './car.service';
import { Car, RentalPlan } from '../models/car.model';

describe('CarService', () => {
  let service: CarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the daily price for daily plan', () => {
    const car = {
      pricePerDay: 150,
      pricePerWeek: 900,
      pricePerMonth: 3000
    } as Car;

    const result = service.getPrice(
      car,
      'daily' as RentalPlan
    );

    expect(result).toBe(150);
  });

  it('should return the weekly price for weekly plan', () => {
    const car = {
      pricePerDay: 150,
      pricePerWeek: 900,
      pricePerMonth: 3000
    } as Car;

    const result = service.getPrice(
      car,
      'weekly' as RentalPlan
    );

    expect(result).toBe(900);
  });

  it('should return the monthly price for monthly plan', () => {
    const car = {
      pricePerDay: 150,
      pricePerWeek: 900,
      pricePerMonth: 3000
    } as Car;

    const result = service.getPrice(
      car,
      'monthly' as RentalPlan
    );

    expect(result).toBe(3000);
  });
});
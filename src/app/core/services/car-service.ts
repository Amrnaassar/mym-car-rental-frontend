import { Injectable } from '@angular/core';

import {
  Car,
  RentalPlan
} from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private readonly cars: readonly Car[] = [

    {
      id: 1,

      name: 'Mercedes S-Class',

      categoryId: 2,

      image: 'assets/images/cars/mercedes-s-class.jpg',

      pricePerDay: 600,
      pricePerWeek: 3500,
      pricePerMonth: 12000,

      rating: 4.9,
      reviews: 120,

      transmission: 'Automatic',

      fuelType: 'Petrol',

      seats: 5,
      doors: 4,
      luggage: 3,

      description:
        'Experience luxury, comfort and advanced technology with the Mercedes S-Class.'
    },

    {
      id: 2,

      name: 'BMW 7 Series',

      categoryId: 2,

      image: 'assets/images/cars/bmw-7-series.jpg',

      pricePerDay: 550,
      pricePerWeek: 3200,
      pricePerMonth: 11000,

      rating: 4.8,
      reviews: 96,

      transmission: 'Automatic',

      fuelType: 'Petrol',

      seats: 5,
      doors: 4,
      luggage: 3,

      description:
        'A refined executive sedan combining dynamic performance with premium comfort.'
    },

    {
      id: 3,

      name: 'Range Rover Vogue',

      categoryId: 1,

      image: 'assets/images/cars/range-rover-vogue.jpg',

      pricePerDay: 700,
      pricePerWeek: 4200,
      pricePerMonth: 14500,

      rating: 4.9,
      reviews: 88,

      transmission: 'Automatic',

      fuelType: 'Diesel',

      seats: 5,
      doors: 5,
      luggage: 4,

      description:
        'Luxury SUV with commanding presence, exceptional comfort and all-terrain capability.'
    },

    {
      id: 4,

      name: 'Porsche 911 Carrera',

      categoryId: 3,

      image: 'assets/images/cars/porsche-911.jpg',

      pricePerDay: 850,
      pricePerWeek: 5000,
      pricePerMonth: 17000,

      rating: 4.9,
      reviews: 74,

      transmission: 'Automatic',

      fuelType: 'Petrol',

      seats: 2,
      doors: 2,
      luggage: 2,

      description:
        'Iconic sports car delivering thrilling performance and unmistakable Porsche design.'
    },

    {
      id: 5,

      name: 'Audi R8',

      categoryId: 3,

      image: 'assets/images/cars/audi-r8.jpg',

      pricePerDay: 900,
      pricePerWeek: 5300,
      pricePerMonth: 18000,

      rating: 4.8,
      reviews: 61,

      transmission: 'Automatic',

      fuelType: 'Petrol',

      seats: 2,
      doors: 2,
      luggage: 2,

      description:
        'A breathtaking performance coupe engineered for an unforgettable driving experience.'
    },

    {
      id: 6,

      name: 'Lamborghini Huracán',

      categoryId: 3,

      image: 'assets/images/cars/lamborghini-huracan.jpg',

      pricePerDay: 1200,
      pricePerWeek: 7000,
      pricePerMonth: 24000,

      rating: 5.0,
      reviews: 43,

      transmission: 'Automatic',

      fuelType: 'Petrol',

      seats: 2,
      doors: 2,
      luggage: 2,

      description:
        'Pure Italian performance with dramatic styling and extraordinary road presence.'
    },

    {
      id: 7,

      name: 'Mercedes E-Class',

      categoryId: 2,

      image: 'assets/images/cars/mercedes-e-class.jpg',

      pricePerDay: 450,
      pricePerWeek: 2600,
      pricePerMonth: 9000,

      rating: 4.7,
      reviews: 102,

      transmission: 'Automatic',

      fuelType: 'Petrol',

      seats: 5,
      doors: 4,
      luggage: 3,

      description:
        'A sophisticated business sedan offering comfort, technology and elegant design.'
    },

    {
      id: 8,

      name: 'BMW X5',

      categoryId: 1,

      image: 'assets/images/cars/bmw-x5.jpg',

      pricePerDay: 650,
      pricePerWeek: 3800,
      pricePerMonth: 13000,

      rating: 4.8,
      reviews: 91,

      transmission: 'Automatic',

      fuelType: 'Hybrid',

      seats: 5,
      doors: 5,
      luggage: 4,

      description:
        'Premium SUV combining spaciousness, power and sophisticated BMW technology.'
    }

  ];

  getCars(): readonly Car[] {
    return this.cars;
  }

  getCarById(
    id: number
  ): Car | undefined {

    return this.cars.find(
      car => car.id === id
    );
  }

  getCarsByCategory(
    categoryId: number
  ): readonly Car[] {

    return this.cars.filter(
      car => car.categoryId === categoryId
    );
  }

  getPrice(
    car: Car,
    plan: RentalPlan
  ): number {

    switch (plan) {

      case 'weekly':
        return car.pricePerWeek;

      case 'monthly':
        return car.pricePerMonth;

      case 'daily':
      default:
        return car.pricePerDay;
    }
  }
}
export type RentalPlan =
  | 'daily'
  | 'weekly'
  | 'monthly';

export type Transmission =
  | 'Automatic'
  | 'Manual';

export type FuelType =
  | 'Petrol'
  | 'Diesel'
  | 'Hybrid';

export interface Car {
  id: number;

  name: string;

  categoryId: number;

  image: string;

  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;

  rating: number;
  reviews: number;

  transmission: Transmission;

  fuelType: FuelType;

  seats: number;
  doors: number;
  luggage: number;

  description: string;

  isAvailable: boolean;
  isFeatured: boolean;
  
 
}
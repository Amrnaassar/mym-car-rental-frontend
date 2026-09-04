export type RentalPlan =
  | 'daily'
  | 'weekly'
  | 'monthly';

export enum Transmission {
  Automatic = 0,
  Manual = 1
}

export enum FuelType {
  Petrol = 0,
  Diesel = 1,
  Hybrid = 2
}

export interface CarImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Car {
  id: number;
  categoryId: number;

  nameAr: string;
  nameEn: string;

  descriptionAr: string | null;
  descriptionEn: string | null;

  categoryNameAr: string;
  categoryNameEn: string;

  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;

  transmission: Transmission;
  fuelType: FuelType;

  seats: number;
  doors: number;
  luggage: number;

  rating: number;
  reviewsCount: number;

  isActive: boolean;
  isFeatured: boolean;

  primaryImageUrl: string | null;
  images: CarImage[];

  createdAt: string;
  updatedAt: string;
}
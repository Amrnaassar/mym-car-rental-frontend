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

export interface CarFeature {
  id: number;
  featureAr: string;
  featureEn: string;
}

export interface Car {
  id: number;
  categoryId: number;

  // =========================
  // Multilingual Content
  // =========================

  nameAr: string;
  nameEn: string;

  descriptionAr: string | null;
  descriptionEn: string | null;

  // =========================
  // Category
  // =========================

  categoryNameAr: string;
  categoryNameEn: string;

  // =========================
  // Pricing
  // =========================

  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;

  // =========================
  // Specifications
  // =========================

  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  doors: number;
  luggage: number;

  // =========================
  // Reviews
  // =========================

  rating: number;
  reviewsCount: number;

  // =========================
  // Status
  // =========================

  isActive: boolean;
  isFeatured: boolean;

  // =========================
  // Features
  // =========================

  features: CarFeature[];

  // =========================
  // Images
  // =========================

  primaryImageUrl: string | null;
  images: CarImage[];

  // =========================
  // Audit
  // =========================

  createdAt: string;
  updatedAt: string;
}
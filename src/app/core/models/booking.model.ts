import { RentalPlan } from './car.model';

// ============================================================
// BOOKING STATUS
// Must match backend enum values
// ============================================================

export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3
}

// ============================================================
// RENTAL PLAN
// Must match backend enum values
// ============================================================

export enum BookingRentalPlan {
  Daily = 0,
  Weekly = 1,
  Monthly = 2
}

// ============================================================
// BOOKING FORM MODEL
// Frontend state used while completing the 4 steps
// ============================================================

export interface BookingModel {
  carId: number | null;

  pickupDate: string;
  returnDate: string;
  pickupLocation: string;

  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  drivingLicense: string;

  includeInsurance: boolean;

  notes: string;

  // Frontend-only calculated values.
  // These are NOT sent to the backend.
  rentalPlan: BookingRentalPlan;
  rentalDays: number;
  rentalPrice: number;
  insurancePrice: number;
  grandTotal: number;
}

// ============================================================
// CREATE BOOKING REQUEST
// Exact shape expected by backend
// ============================================================

export interface CreateBookingDto {
  carId: number;

  pickupLocation: string;

  pickupDate: string;
  returnDate: string;

  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  drivingLicense: string;

  includeInsurance: boolean;

  notes?: string | null;
}

// ============================================================
// UPDATE BOOKING STATUS
// ============================================================

export interface UpdateBookingStatusDto {
  status: BookingStatus;
}

// ============================================================
// BOOKING RESPONSE
// Exact shape returned by backend BookingDto
// ============================================================

export interface BookingResponse {
  id: string;

  bookingNumber: string;

  carId: number;
  carName: string;

  pickupLocation: string;

  pickupDate: string;
  returnDate: string;

  rentalDays: number;
  rentalPlan: BookingRentalPlan;

  customerFullName: string;
  customerEmail: string;
  customerPhone: string;

  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;

  rentalCost: number;
  insuranceCost: number;
  taxCost: number;
  discountAmount: number;
  grandTotal: number;

  status: BookingStatus;

  notes: string | null;

  createdAt: string;
}
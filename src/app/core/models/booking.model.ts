import { RentalPlan } from "./car.model";

export interface BookingModel {
  carId: number | null;

  pickupDate: string;
  returnDate: string;
  pickupLocation: string;

  rentalPlan: RentalPlan;

  fullName: string;
  email: string;
  phone: string;
  drivingLicense: string;

  rentalDays: number;
  rentalPrice: number;
  insurancePrice: number;
  grandTotal: number;
}

export enum RentalPlan {
  Daily = 0,
  Weekly = 1,
  Monthly = 2
}

export enum RentalContractStatus {
  Active = 0,
  Completed = 1,
  Cancelled = 2
}

export interface RentalContract {
  id: string;
  contractNumber: string;

  customerId: number;
  customerName: string;
  customerPhone: string;
  drivingLicenseNumber: string;

  carId: number;
  carName: string;
  plateNumber: string;

  supplierId: number | null;
  supplierName: string | null;

  rentalPlan: RentalPlan;
  startDate: string;
  endDate: string;
  rentalDays: number;

  agreedDailyRate: number;
  supplierDailyCost: number;
  totalSupplierCost: number;
  additionalExpenses: number;
  insuranceCost: number;
  taxCost: number;
  discountAmount: number;
  grandTotal: number;
  netProfit: number;

  status: RentalContractStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateRentalContractRequest {
  customerId: number;
  carId: number;
  rentalPlan: RentalPlan;
  startDate: string;
  endDate: string;

  agreedDailyRate: number;
  supplierDailyCost: number;
  additionalExpenses: number;
  insuranceCost: number;
  taxCost: number;
  discountAmount: number;

  notes: string | null;
}
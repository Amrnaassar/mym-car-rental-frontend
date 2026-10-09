export interface Customer {
id: number;
fullName: string;
phone: string;
nationality: string;
drivingLicenseNumber: string;
email: string | null;
createdAt: string;
}

export interface CreateCustomerRequest {
fullName: string;
phone: string;
nationality: string;
drivingLicenseNumber: string;
email: string | null;
}

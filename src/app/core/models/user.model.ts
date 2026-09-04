export enum UserRole {
  Customer = 0,
  Employee = 1,
  Manager = 2
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}
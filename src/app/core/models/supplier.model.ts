
export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string | null;  
  createdAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
}
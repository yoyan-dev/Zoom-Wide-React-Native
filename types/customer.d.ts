import type { CustomerType } from "./auth";

export interface Customer {
  id: string;
  user_id: string | null;
  customer_type?: CustomerType | null;
  company_name: string | null;
  contact_name: string;
  phone: string | null;
  email: string;
  billing_address: string | null;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface FetchCustomerParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface CustomerPagination {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

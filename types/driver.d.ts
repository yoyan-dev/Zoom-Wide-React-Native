export interface Driver {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  license_number: string | null;
  vehicle_number: string | null;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FetchDriverParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface DriverPagination {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

export interface CreateDriverPayload {
  email: string;
  password: string;
  name: string;
  phone?: string | null;
  license_number?: string | null;
  vehicle_number?: string | null;
}

export interface UpdateDriverPayload {
  email?: string | null;
  password?: string | null;
  name?: string | null;
  phone?: string | null;
  license_number?: string | null;
  vehicle_number?: string | null;
  is_active?: boolean;
}

export type UserRole =
  | "admin"
  | "manager"
  | "staff"
  | "customer"
  | "warehouse_manager"
  | "finance"
  | "driver"
  | "supplier"
  | "auditor";

export type InternalUserRole = Exclude<UserRole, "customer" | "driver">;

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FetchUserParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
  role: InternalUserRole;
}

export interface UpdateUserPayload {
  email?: string | null;
  password?: string | null;
  full_name?: string | null;
  phone?: string | null;
  role?: InternalUserRole;
  is_active?: boolean;
}

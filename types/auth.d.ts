import type { Customer } from "./customer";
import type { UserRole } from "./user";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
  contact_name?: string | null;
  phone?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface AuthSession {
  user: AuthenticatedUser;
  customer: Customer | null;
  token?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  session?: {
    access_token?: string | null;
    refresh_token?: string | null;
    expires_in?: number | null;
    token_type?: string | null;
    scope?: string | null;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  company_name: string;
  contact_name: string;
  phone?: string | null;
  billing_address?: string | null;
  shipping_address?: string | null;
}

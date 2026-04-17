import type { AuthenticatedUser } from "./auth";
import type { Customer } from "./customer";
import type { Driver } from "./driver";

export interface AccountProfile {
  user: AuthenticatedUser;
  customer?: Customer | null;
  driver?: Driver | null;
  [key: string]: unknown;
}

export interface UpdateAccountPayload {
  email?: string | null;
  phone?: string | null;
  image_url?: string | null;
  full_name?: string | null;
  name?: string | null;
  contact_name?: string | null;
  company_name?: string | null;
  billing_address?: string | null;
  shipping_address?: string | null;
  license_number?: string | null;
  vehicle_number?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

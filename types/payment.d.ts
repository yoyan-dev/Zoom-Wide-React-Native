export type PaymentMethod = "cash" | "card" | "bank_transfer" | "mobile_wallet";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_ref: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FetchPaymentParams {
  q?: string;
  status?: PaymentStatus | "";
  method?: PaymentMethod | "";
  order_id?: string;
  page?: number;
  limit?: number;
}

export interface CreatePaymentPayload {
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status?: PaymentStatus;
  transaction_ref?: string | null;
  paid_at?: string | null;
}

export interface UpdatePaymentPayload {
  status: PaymentStatus;
  transaction_ref?: string | null;
  paid_at?: string | null;
}

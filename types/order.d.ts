import type { Delivery } from "./delivery";

export type OrderStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  notes: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
  updated_at: string;
}

export interface DriverAssignedOrder extends Order {
  delivery?: Delivery | null;
  deliveries?: Delivery[] | null;
  items?: OrderItem[] | null;
}

export interface CreateOrderItemPayload {
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface CreateOrderPayload {
  customer_id?: string;
  status?: OrderStatus;
  total_amount: number;
  notes?: string | null;
  items: CreateOrderItemPayload[];
}

export interface ApproveOrderPayload {
  approved_by?: string | null;
}

export interface RejectOrderPayload {
  rejection_reason: string;
}

export interface FetchOrderParams {
  q?: string;
  status?: OrderStatus | "";
  customer_id?: string;
  page?: number;
  limit?: number;
}

export interface OrderPagination {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

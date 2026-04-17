export type CartStatus = "active" | "checked_out" | "abandoned";

export interface Cart {
  id: string;
  customer_id: string;
  status: CartStatus;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

export interface CartLineItem {
  id?: string | null;
  cart_id?: string | null;
  product_id: string;
  sku?: string | null;
  category_id?: string | null;
  name: string;
  image_url: string | null;
  unit: string;
  price: number;
  quantity: number;
}

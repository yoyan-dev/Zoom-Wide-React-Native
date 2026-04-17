import type { Category } from "./category";
import type { Warehouse } from "./warehouse";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductHandbookDetails {
  summary?: string;
  features?: string[];
  applications?: string[];
  specifications?: ProductSpecification[];
}

export interface Product {
  id?: string;
  category_id?: string;
  warehouse_id?: string | null;
  sku?: string;
  name?: string;
  description?: string | null;
  image_url?: string | null;
  unit?: string;
  price?: number;
  stock_quantity?: number;
  minimum_stock_quantity?: number;
  category?: Category;
  warehouse?: Warehouse;
  handbook?: ProductHandbookDetails;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormSubmitValue {
  product: Omit<Product, "id" | "created_at" | "updated_at">;
  imageFile: File | null;
}

export interface FetchProductParams {
  q?: string;
  category_id?: string;
  page?: number;
  limit?: number;
}

export interface ProductPaginaton {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

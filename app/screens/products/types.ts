import type { Product } from "@/types/product";

export type ProductStatus = "in-stock" | "limited-stock" | "out-of-stock";

export type ProductListingItem = Product & {
  id: string;
  status: ProductStatus;
};

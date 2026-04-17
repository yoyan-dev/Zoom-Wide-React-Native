export type ProductStatus = "in-stock" | "limited-stock" | "out-of-stock";

export type ProductListingItem = {
  id: string;
  name: string;
  specification: string;
  price: string;
  unit: string;
  status: ProductStatus;
  image: string;
};

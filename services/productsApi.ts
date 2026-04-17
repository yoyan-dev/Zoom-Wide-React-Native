import { apiRequest } from "@/services/apiClient";
import type { FetchProductParams, Product } from "@/types/product";

function toQueryString(params: FetchProductParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.category_id) {
    searchParams.set("category_id", params.category_id);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function fetchProducts(params?: FetchProductParams) {
  return apiRequest<Product[]>(`/products${toQueryString(params)}`, {
    method: "GET",
  });
}

export function fetchProductById(productId: string) {
  return apiRequest<Product>(`/products/${productId}`, {
    method: "GET",
  });
}

import { apiRequest } from "@/services/apiClient";
import type { Category, FetchCategoryParams } from "@/types/category";

function toQueryString(params: FetchCategoryParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
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

export function fetchCategories(params?: FetchCategoryParams) {
  return apiRequest<Category[]>(`/categories${toQueryString(params)}`, {
    method: "GET",
  });
}

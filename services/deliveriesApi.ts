import { apiRequest } from "@/services/apiClient";
import type { Delivery, FetchDeliveryParams } from "@/types/delivery";

function toQueryString(params: FetchDeliveryParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.order_id) {
    searchParams.set("order_id", params.order_id);
  }

  if (params.driver_id) {
    searchParams.set("driver_id", params.driver_id);
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

export function fetchDeliveries(accessToken: string, params?: FetchDeliveryParams) {
  return apiRequest<Delivery[]>(`/deliveries${toQueryString(params)}`, {
    accessToken,
    method: "GET",
  });
}

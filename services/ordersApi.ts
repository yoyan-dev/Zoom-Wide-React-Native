import { apiRequest } from "@/services/apiClient";
import type { DriverAssignedOrder, FetchOrderParams, Order } from "@/types/order";

function toQueryString(params: FetchOrderParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.customer_id) {
    searchParams.set("customer_id", params.customer_id);
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

export function fetchOrders(accessToken: string, params?: FetchOrderParams) {
  return apiRequest<Order[]>(`/orders${toQueryString(params)}`, {
    accessToken,
    method: "GET",
  });
}

export function fetchOrderById(accessToken: string, orderId: string) {
  return apiRequest<DriverAssignedOrder>(`/orders/${orderId}`, {
    accessToken,
    method: "GET",
  });
}

import { apiRequest } from "@/services/apiClient";
import type { Address, AddressPayload, FetchAddressParams } from "@/types/address";

function toQueryString(params: FetchAddressParams = {}) {
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

function customerAddressPath(customerId: string, addressId?: string, query?: string) {
  const basePath = `/customers/${customerId}/addresses`;

  if (!addressId) {
    return `${basePath}${query ?? ""}`;
  }

  return `${basePath}/${addressId}${query ?? ""}`;
}

export function fetchCustomerAddresses(
  accessToken: string,
  customerId: string,
  params?: FetchAddressParams,
) {
  return apiRequest<Address[]>(customerAddressPath(customerId, undefined, toQueryString(params)), {
    accessToken,
    method: "GET",
  });
}

export function fetchCustomerAddress(
  accessToken: string,
  customerId: string,
  addressId: string,
) {
  return apiRequest<Address>(customerAddressPath(customerId, addressId), {
    accessToken,
    method: "GET",
  });
}

export function createCustomerAddress(
  accessToken: string,
  customerId: string,
  payload: AddressPayload,
) {
  return apiRequest<Address>(customerAddressPath(customerId), {
    accessToken,
    body: payload,
    method: "POST",
  });
}

export function updateCustomerAddress(
  accessToken: string,
  customerId: string,
  addressId: string,
  payload: Partial<AddressPayload>,
) {
  return apiRequest<Address>(customerAddressPath(customerId, addressId), {
    accessToken,
    body: payload,
    method: "PATCH",
  });
}

export function deleteCustomerAddress(
  accessToken: string,
  customerId: string,
  addressId: string,
) {
  return apiRequest<unknown>(customerAddressPath(customerId, addressId), {
    accessToken,
    method: "DELETE",
  });
}

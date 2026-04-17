import { apiRequest } from "@/services/apiClient";
import type { CartLineItem } from "@/types/cart";

export type CartApiResponse =
  | CartLineItem[]
  | {
      cart?: unknown;
      items?: CartLineItem[];
      line_items?: CartLineItem[];
      data?: CartLineItem[];
      [key: string]: unknown;
    };

type CartRequestContext = {
  accessToken: string;
  customerId: string;
};

function customerQuery(customerId: string) {
  return `?customer_id=${encodeURIComponent(customerId)}`;
}

export function fetchCart({ accessToken, customerId }: CartRequestContext) {
  return apiRequest<CartApiResponse>(`/cart${customerQuery(customerId)}`, {
    accessToken,
    method: "GET",
  });
}

export function addCartItem({
  accessToken,
  customerId,
  productId,
  quantity,
}: CartRequestContext & {
  productId: string;
  quantity: number;
}) {
  return apiRequest<CartApiResponse>("/cart/items", {
    accessToken,
    body: {
      customer_id: customerId,
      product_id: productId,
      quantity,
    },
    method: "POST",
  });
}

export function deleteCartItem({
  accessToken,
  customerId,
  itemId,
}: CartRequestContext & {
  itemId: string;
}) {
  return apiRequest<CartApiResponse>(
    `/cart/items/${itemId}${customerQuery(customerId)}`,
    {
      accessToken,
      method: "DELETE",
    },
  );
}

export function clearCart({ accessToken, customerId }: CartRequestContext) {
  return apiRequest<CartApiResponse>(`/cart${customerQuery(customerId)}`, {
    accessToken,
    method: "DELETE",
  });
}

export function checkoutCart({
  accessToken,
  customerId,
  notes,
}: CartRequestContext & {
  notes?: string;
}) {
  return apiRequest<unknown>("/cart/checkout", {
    accessToken,
    body: {
      customer_id: customerId,
      notes,
    },
    method: "POST",
  });
}

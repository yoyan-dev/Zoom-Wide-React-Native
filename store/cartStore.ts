import { create } from "zustand";

import * as cartApi from "@/services/cartApi";
import { ApiClientError } from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import { fetchProductById } from "@/services/productsApi";
import type { CartLineItem } from "@/types/cart";
import type { Product } from "@/types/product";

type CartState = {
  error: string | null;
  hasLoaded: boolean;
  isCheckingOut: boolean;
  isLoading: boolean;
  items: CartLineItem[];
  updatingItemIds: string[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  checkout: (notes?: string) => Promise<unknown>;
  clearCart: () => Promise<void>;
  clearError: () => void;
  loadCart: () => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  setItemQuantity: (item: CartLineItem, quantity: number) => Promise<void>;
};

function getCartContext() {
  const { accessToken, customer } = useAuthStore.getState();

  if (!accessToken || !customer?.id) {
    throw new Error("Please sign in with a customer account to use the cart.");
  }

  return {
    accessToken,
    customerId: customer.id,
  };
}

function toErrorMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to update your cart. Please try again.";
}

function normalizeCartItems(response: cartApi.CartApiResponse): CartLineItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  const cartRecord =
    "cart" in response && response.cart && typeof response.cart === "object"
      ? (response.cart as {
          items?: CartLineItem[];
          line_items?: CartLineItem[];
          data?: CartLineItem[];
        })
      : null;

  return (
    response.items ??
    response.line_items ??
    response.data ??
    cartRecord?.items ??
    cartRecord?.line_items ??
    cartRecord?.data ??
    []
  );
}

const productCache = new Map<string, Product>();

function getItemUnit(item: CartLineItem, product?: Product | null) {
  return item.unit ?? product?.unit ?? "unit";
}

function getItemPrice(item: CartLineItem, product?: Product | null) {
  if (typeof item.price === "number") {
    return item.price;
  }

  if (typeof item.unit_price === "number") {
    return item.unit_price;
  }

  if (typeof product?.price === "number") {
    return product.price;
  }

  return null;
}

async function fetchProductFromCache(productId: string) {
  const cachedProduct = productCache.get(productId);

  if (cachedProduct) {
    return cachedProduct;
  }

  try {
    const product = await fetchProductById(productId);

    if (product) {
      productCache.set(productId, product);
    }

    return product;
  } catch {
    return null;
  }
}

async function enrichCartItems(items: CartLineItem[]) {
  return Promise.all(
    items.map(async (item) => {
      const product = await fetchProductFromCache(item.product_id);

      return {
        ...item,
        category_id: item.category_id ?? product?.category_id ?? null,
        image_url: item.image_url ?? product?.image_url ?? null,
        name: item.name ?? product?.name ?? item.sku ?? item.product_id,
        price: getItemPrice(item, product),
        sku: item.sku ?? product?.sku ?? null,
        unit: getItemUnit(item, product),
      } satisfies CartLineItem;
    }),
  );
}

export const useCartStore = create<CartState>((set, get) => ({
  error: null,
  hasLoaded: false,
  isCheckingOut: false,
  isLoading: false,
  items: [],
  updatingItemIds: [],

  addItem: async (productId: string, quantity = 1) => {
    const context = getCartContext();
    set({ error: null, isLoading: true });

    try {
      const response = await cartApi.addCartItem({
        ...context,
        productId,
        quantity,
      });
      const items = await enrichCartItems(normalizeCartItems(response));
      set({ hasLoaded: true, items, isLoading: false });
    } catch (error) {
      set({ error: toErrorMessage(error), hasLoaded: true, isLoading: false });
      throw error;
    }
  },

  checkout: async (notes?: string) => {
    const context = getCartContext();
    set({ error: null, isCheckingOut: true });

    try {
      const response = await cartApi.checkoutCart({ ...context, notes });
      set({ hasLoaded: true, isCheckingOut: false, items: [] });
      return response;
    } catch (error) {
      set({ error: toErrorMessage(error), isCheckingOut: false });
      throw error;
    }
  },

  clearCart: async () => {
    const context = getCartContext();
    set({ error: null, isLoading: true });

    try {
      const response = await cartApi.clearCart(context);
      const items = await enrichCartItems(normalizeCartItems(response));
      set({ hasLoaded: true, items, isLoading: false });
    } catch (error) {
      set({ error: toErrorMessage(error), hasLoaded: true, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  loadCart: async () => {
    const context = getCartContext();
    set({ error: null, isLoading: true });

    try {
      const response = await cartApi.fetchCart(context);
      const items = await enrichCartItems(normalizeCartItems(response));
      set({ hasLoaded: true, items, isLoading: false });
    } catch (error) {
      set({ error: toErrorMessage(error), hasLoaded: true, isLoading: false });
    }
  },

  removeItem: async (itemId: string) => {
    const context = getCartContext();
    set({ error: null, isLoading: true });

    try {
      const response = await cartApi.deleteCartItem({
        ...context,
        itemId,
      });
      const items = await enrichCartItems(normalizeCartItems(response));
      set({ hasLoaded: true, items, isLoading: false });
    } catch (error) {
      set({ error: toErrorMessage(error), hasLoaded: true, isLoading: false });
      throw error;
    }
  },

  setItemQuantity: async (item: CartLineItem, quantity: number) => {
    if (quantity === item.quantity) {
      return;
    }

    if (quantity <= 0) {
      if (item.id) {
        await get().removeItem(item.id);
      }
      return;
    }

    const context = getCartContext();
    const itemKey = item.id ?? item.product_id;
    const previousItems = get().items;

    set((state) => ({
      error: null,
      items: state.items.map((cartItem) =>
        (cartItem.id ?? cartItem.product_id) === itemKey
          ? { ...cartItem, quantity }
          : cartItem,
      ),
      updatingItemIds: [...state.updatingItemIds, itemKey],
    }));

    try {
      if (item.id) {
        await cartApi.deleteCartItem({
          ...context,
          itemId: item.id,
        });
      }

      const response = await cartApi.addCartItem({
        ...context,
        productId: item.product_id,
        quantity,
      });

      const serverItems = await enrichCartItems(normalizeCartItems(response));
      const updatedServerItem = serverItems.find(
        (serverItem) => serverItem.product_id === item.product_id,
      );

      set((state) => ({
        hasLoaded: true,
        items: updatedServerItem
          ? state.items.map((cartItem) =>
              (cartItem.id ?? cartItem.product_id) === itemKey
                ? updatedServerItem
                : cartItem,
            )
          : state.items,
        updatingItemIds: state.updatingItemIds.filter((id) => id !== itemKey),
      }));
    } catch (error) {
      set((state) => ({
        error: toErrorMessage(error),
        hasLoaded: true,
        items: previousItems,
        updatingItemIds: state.updatingItemIds.filter((id) => id !== itemKey),
      }));
      throw error;
    }
  },
}));

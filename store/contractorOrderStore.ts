import { create } from "zustand";

import type { Product } from "@/types/product";

export type ContractorPaymentMethod = "gcash" | "cash" | "card";

export type ContractorOrderLine = {
  productId: string;
  name: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  stockQuantity: number | null;
  unit: string;
};

type ContractorOrderState = {
  selectedProjectId: string | null;
  items: ContractorOrderLine[];
  addItem: (product: Product, quantity: number) => void;
  clearOrder: () => void;
  removeItem: (productId: string) => void;
  reorderItems: (items: ContractorOrderLine[], projectId?: string | null) => void;
  setProject: (projectId: string | null) => void;
  setQuantity: (productId: string, quantity: number) => void;
};

function toOrderLine(product: Product, quantity: number): ContractorOrderLine {
  return {
    imageUrl: product.image_url ?? null,
    name: product.name ?? "Material",
    price: typeof product.price === "number" ? product.price : 0,
    productId: product.id ?? "",
    quantity,
    stockQuantity:
      typeof product.stock_quantity === "number" ? product.stock_quantity : null,
    unit: product.unit ?? "unit",
  };
}

export const useContractorOrderStore = create<ContractorOrderState>((set) => ({
  items: [],
  selectedProjectId: null,

  addItem: (product, quantity) => {
    if (!product.id || quantity <= 0) {
      return;
    }

    set((state) => {
      const existingItem = state.items.find((item) => item.productId === product.id);

      if (!existingItem) {
        return {
          items: [...state.items, toOrderLine(product, quantity)],
        };
      }

      return {
        items: state.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      };
    });
  },

  clearOrder: () => set({ items: [] }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  reorderItems: (items, projectId = null) =>
    set({
      items,
      selectedProjectId: projectId,
    }),

  setProject: (selectedProjectId) => set({ selectedProjectId }),

  setQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((item) => item.productId !== productId)
          : state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
    })),
}));

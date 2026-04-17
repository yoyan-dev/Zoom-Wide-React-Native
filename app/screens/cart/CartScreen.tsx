import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useCartStore } from "@/store/cartStore";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

import { OrderSummary } from "./sections/OrderSummary";
import { SecurePaymentNote } from "./ui/SecurePaymentNote";
import { CartItemCard } from "./ui/CartItemCard";
import { type SummaryLine } from "./types";

export function CartScreen() {
  const router = useRouter();
  const error = useCartStore((state) => state.error);
  const isCheckingOut = useCartStore((state) => state.isCheckingOut);
  const isLoading = useCartStore((state) => state.isLoading);
  const items = useCartStore((state) => state.items);
  const loadCart = useCartStore((state) => state.loadCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const setItemQuantity = useCartStore((state) => state.setItemQuantity);
  const updatingItemIds = useCartStore((state) => state.updatingItemIds);

  useFocusEffect(
    useCallback(() => {
      void loadCart();
    }, [loadCart]),
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + (item.price ?? item.unit_price ?? 0) * item.quantity,
        0,
      ),
    [items],
  );

  const summaryLines: SummaryLine[] = [
    { label: "Subtotal", value: formatPhilippinePeso(subtotal) },
    {
      accent: true,
      label: "Freight & Handling",
      value: "Calculated at checkout",
    },
  ];

  const handleCheckout = async () => {
    router.push("/checkout");
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-32 pt-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-5xl">
        <View className="mb-10">
          <Text className="text-4xl font-black uppercase tracking-tighter text-primary-900">
            Shopping Cart
          </Text>
          <Text className="mt-2 font-semibold uppercase tracking-wide text-neutral-600">
            {items.length} item{items.length === 1 ? "" : "s"} ready for checkout
          </Text>
        </View>

        {isLoading ? (
          <View className="mb-8 items-center justify-center rounded-xl bg-white p-8">
            <ActivityIndicator color="#0A2238" />
            <Text className="mt-4 text-xs font-black uppercase tracking-widest text-neutral-500">
              Loading cart
            </Text>
          </View>
        ) : null}

        {error ? (
          <View className="mb-8 rounded-xl border border-red-100 bg-red-50 p-5">
            <Text className="text-base font-black text-red-700">
              Cart unavailable
            </Text>
            <Text className="mt-2 text-sm font-semibold leading-5 text-red-700">
              {error}
            </Text>
            <Pressable
              className="mt-4 self-start rounded-lg bg-red-700 px-4 py-3 active:opacity-80"
              onPress={() => void loadCart()}
            >
              <Text className="text-xs font-black uppercase tracking-widest text-white">
                Retry
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View className="gap-8">
          <View className="gap-6">
            {!isLoading && items.length === 0 ? (
              <View className="rounded-xl bg-white p-6">
                <Text className="text-base font-black text-primary-900">
                  Your cart is empty
                </Text>
                <Text className="mt-2 text-sm font-semibold text-neutral-500">
                  Add materials from the catalog to prepare your order.
                </Text>
                <Pressable
                  className="mt-5 self-start rounded-lg bg-primary-900 px-4 py-3 active:bg-primary-800"
                  onPress={() => router.push("/categories")}
                >
                  <Text className="text-xs font-black uppercase tracking-widest text-white">
                    Browse Catalog
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {items.map((item) => (
              <CartItemCard
                isUpdating={updatingItemIds.includes(item.id ?? item.product_id)}
                item={item}
                key={item.id ?? item.product_id}
                onDecrease={() =>
                  void setItemQuantity(item, Math.max(item.quantity - 1, 0))
                }
                onIncrease={() => void setItemQuantity(item, item.quantity + 1)}
                onRemove={() => (item.id ? void removeItem(item.id) : undefined)}
              />
            ))}
          </View>

          <View>
            <OrderSummary
              isCheckingOut={isCheckingOut}
              lines={summaryLines}
              onCheckout={handleCheckout}
              total={subtotal}
            />
            <SecurePaymentNote />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

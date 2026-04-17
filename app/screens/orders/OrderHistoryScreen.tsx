import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import * as ordersApi from "@/services/ordersApi";
import { useAuthStore } from "@/store/authStore";
import type { Order, OrderStatus } from "@/types/order";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

const orderCardImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDGAEJuxPOl2X_nyDXKrJFRZIBWNzOzohzj_wnV9fzuBq1usMqdMqa7HAdPm1FBLOn2hWr1X0I1Sm12DEv0yMtvFfpWK2c8lBUHUUzQXdRwtgi9TkMSpaumGZRvwOIh4l3DXh_cg8HDYOJjeGwG6CQhCc6tpfJnE74U4Z73kugInw_1WiN3PxkG90G6Z8omqjZ7mKIieLKzSh4r2zsyIXrDTJ8ww2TltyiS6yEZrmLjak_00wK2TL2q4PAAJBVbupnctV_vFrLTzBw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuArSCbsgm4KjE8hhvcGxG1ru9mUohpSVVycqfyXUlen6dxQqPRTZcNOWqnWXtdjRLPECLOMwajrQcRctrD5TpNty1sMgbXuw6Pn15Aa8CX1pGdzll7jefkNCbQJzAOTHfAIsS4sGqRFuE1qyZKJ5XQ0HwaHk01-uODpQ4gAQynJmZ3W0tUg_dCO8iZwOYycboTlANjn7VLdADeRIbwrxdBrshyPxgfIyMPQ_M7vs7Y0XojpmVSTwVX3oSU6tCACP_wwpVHDCyY_WHo",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSUsQrFmfevqOY_L1i9AT27mKeJUaM_QBcPHU1cNS5EWQWPLDOSdw2j-Ew-CzeA1KBxq5mJma4vuTAavc8P-ybjJvzoWLwFAwajztYTQ0rTQvLoBjsvE5jNrQnJEzNaXdj1W0PJ0go5FCEk75pDvZGTjKQLsdHVPobkAcUgO8Vc2zs-oACjW247y-GgRKPAy2ovEHsZp2DD9uR9Fe-HgPpYw1yIFTK0fAhqsFO-zGI2N_J_cEFW4pkuXcqZ0SAd-kJsh15tAnVR6Y",
];

const FILTERS: Array<{ label: string; value: "" | OrderStatus }> = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function formatOrderDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-PH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyles(status: OrderStatus) {
  switch (status) {
    case "completed":
      return {
        badgeClassName: "bg-green-100 text-green-800",
        label: "Completed",
      };
    case "approved":
      return {
        badgeClassName: "bg-accent-100 text-accent-800",
        label: "Approved",
      };
    case "rejected":
      return {
        badgeClassName: "bg-red-100 text-red-700",
        label: "Rejected",
      };
    case "cancelled":
      return {
        badgeClassName: "bg-neutral-200 text-neutral-600",
        label: "Cancelled",
      };
    default:
      return {
        badgeClassName: "bg-primary-100 text-primary-900",
        label: "Pending",
      };
  }
}

export function OrderHistoryScreen() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const customer = useAuthStore((state) => state.customer);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<"" | OrderStatus>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!accessToken || !customer?.id) {
      setError("Please sign in with a customer account to review orders.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextOrders = await ordersApi.fetchOrders(accessToken, {
        customer_id: customer.id,
        limit: 50,
        status: activeFilter,
      });
      setOrders(nextOrders);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load order history.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, activeFilter, customer?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadOrders();
    }, [loadOrders]),
  );

  const metrics = useMemo(() => {
    const activeCount = orders.filter(
      (order) => order.status === "pending" || order.status === "approved",
    ).length;
    const completedCount = orders.filter(
      (order) => order.status === "completed",
    ).length;
    const invoicesCount = orders.filter(
      (order) => order.status !== "rejected" && order.status !== "cancelled",
    ).length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + (order.total_amount ?? 0),
      0,
    );

    return {
      activeCount,
      completedCount,
      invoicesCount,
      totalSpent,
    };
  }, [orders]);

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-32 pt-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-5xl">
        <View className="mb-10">
          <Text className="mb-2 text-xs font-black uppercase tracking-[3px] text-accent-700">
            Track Activity
          </Text>
          <Text className="text-4xl font-black tracking-tight text-primary-900">
            Your Pipeline
          </Text>

          <View className="mt-6 flex-row flex-wrap gap-4">
            {[
              { label: "Active", value: String(metrics.activeCount) },
              { label: "Completed", value: String(metrics.completedCount) },
              {
                label: "Total Spent",
                value: formatPhilippinePeso(metrics.totalSpent),
              },
              { label: "Invoices", value: String(metrics.invoicesCount) },
            ].map((metric, index) => (
              <View
                className={[
                  "min-w-[140px] flex-1 rounded-xl bg-neutral-100 p-4",
                  index === 3 ? "border border-primary-100" : "",
                ].join(" ")}
                key={metric.label}
              >
                <Text className="mb-1 text-xs font-black uppercase tracking-widest text-neutral-400">
                  {metric.label}
                </Text>
                <Text className="text-2xl font-black text-primary-900">
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <ScrollView
          className="mb-6"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex-row gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <Pressable
                  className={[
                    "rounded-full px-5 py-2",
                    isActive
                      ? "bg-primary-900"
                      : "bg-neutral-200 active:bg-neutral-300",
                  ].join(" ")}
                  key={filter.label}
                  onPress={() => setActiveFilter(filter.value)}
                >
                  <Text
                    className={[
                      "text-sm font-semibold",
                      isActive ? "text-white" : "text-neutral-600",
                    ].join(" ")}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {isLoading ? (
          <View className="rounded-xl bg-white p-8">
            <ActivityIndicator color="#002A58" />
            <Text className="mt-4 text-xs font-black uppercase tracking-widest text-neutral-500">
              Loading orders
            </Text>
          </View>
        ) : null}

        {error ? (
          <View className="mb-6 rounded-xl border border-red-100 bg-red-50 p-5">
            <Text className="text-sm font-black text-red-700">{error}</Text>
          </View>
        ) : null}

        {!isLoading && !orders.length ? (
          <View className="rounded-xl bg-white p-6">
            <Text className="text-xl font-black text-primary-900">
              No orders found
            </Text>
            <Text className="mt-2 text-sm font-medium leading-6 text-neutral-600">
              Orders you place from checkout will show up here.
            </Text>
          </View>
        ) : null}

        <View className="gap-6">
          {orders.map((order, index) => {
            const status = getStatusStyles(order.status);

            return (
              <View
                className="rounded-xl bg-white p-6"
                key={order.id}
                style={{
                  elevation: 3,
                  shadowColor: "#111418",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 14,
                }}
              >
                <View className="flex-row flex-wrap items-center justify-between gap-6">
                  <View className="flex-row items-center gap-6">
                    <View className="h-16 w-16 overflow-hidden rounded-lg bg-neutral-200">
                      <Image
                        className="h-full w-full"
                        resizeMode="cover"
                        source={{
                          uri: orderCardImages[index % orderCardImages.length],
                        }}
                      />
                    </View>

                    <View className="max-w-[200px]">
                      <View className="mb-1 flex-row flex-wrap items-center gap-3">
                        <Text className="text-lg font-black text-primary-900">
                          #{order.id}
                        </Text>
                        <View
                          className={`rounded px-3 py-1 ${status.badgeClassName}`}
                        >
                          <Text className="text-[10px] font-black uppercase tracking-widest">
                            {status.label}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-sm font-medium text-neutral-500">
                        {formatOrderDate(order.created_at)}
                      </Text>
                      <Text className="mt-1 text-sm font-medium text-neutral-500">
                        {order.notes?.trim() || "Order submitted for processing."}
                      </Text>
                    </View>
                  </View>

                  <View className="min-w-[160px] flex-1 border-t border-neutral-200 pt-4 md:min-w-[220px] md:border-t-0 md:pt-0">
                    <View className="flex-row items-center justify-between gap-4">
                      <View>
                        <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Total Amount
                        </Text>
                        <Text className="text-xl font-black text-primary-900">
                          {formatPhilippinePeso(order.total_amount)}
                        </Text>
                      </View>

                      <View className="flex-row gap-2">
                        <Pressable
                          className="rounded-lg border border-neutral-300 p-3 active:bg-neutral-100"
                          onPress={() =>
                            router.push({
                              pathname: "/order-tracking",
                              params: { order_id: order.id },
                            })
                          }
                        >
                          <MaterialIcons
                            color="#002A58"
                            name="visibility"
                            size={20}
                          />
                        </Pressable>

                        <Pressable
                          className="rounded-lg bg-primary-900 px-5 py-3 active:bg-primary-800"
                          onPress={() => router.push("/categories")}
                        >
                          <Text className="text-xs font-black uppercase tracking-widest text-white">
                            Reorder
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {!isLoading && orders.length >= 50 ? (
          <View className="mt-12 items-center">
            <Pressable
              className="flex-row items-center gap-2 rounded-lg bg-neutral-100 px-8 py-3 active:bg-neutral-200"
              onPress={() => void loadOrders()}
            >
              <Text className="text-sm font-black uppercase tracking-widest text-primary-900">
                Refresh History
              </Text>
              <MaterialIcons color="#002A58" name="history" size={18} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

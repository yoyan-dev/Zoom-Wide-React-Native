import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { StatusPill } from "@/app/screens/contractor/components/StatusPill";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import {
  formatDateTimeLabel,
  getOrderStatusMeta,
} from "@/app/screens/contractor/utils";
import { fetchOrderById, fetchOrders } from "@/services/ordersApi";
import { fetchProductById } from "@/services/productsApi";
import { fetchProjects } from "@/services/projectsApi";
import {
  type ContractorOrderLine,
  useContractorOrderStore,
} from "@/store/contractorOrderStore";
import type { Order } from "@/types/order";
import type { Project } from "@/types/project";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function ContractorOrdersScreen() {
  const router = useRouter();
  const { accessToken, customer } = useContractorSession();
  const reorderItems = useContractorOrderStore((state) => state.reorderItems);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "completed">(
    "all",
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadOrders = useCallback(async () => {
    if (!accessToken || !customer?.id) {
      setError("Sign in with a contractor account to view order history.");
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const [nextOrders, nextProjects] = await Promise.all([
        fetchOrders(accessToken, { customer_id: customer.id, limit: 100 }),
        fetchProjects(accessToken, { limit: 50 }),
      ]);

      setOrders(nextOrders);
      setProjects(nextProjects);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load orders.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, customer?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadOrders();
    }, [loadOrders]),
  );

  const filteredOrders = useMemo(() => {
    if (activeFilter === "completed") {
      return orders.filter((order) => order.status === "completed");
    }
    if (activeFilter === "active") {
      return orders.filter((order) => order.status !== "completed");
    }
    return orders;
  }, [activeFilter, orders]);

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Review all project-linked orders and reopen past material mixes with one tap."
        title="Orders & History"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="mb-5 flex-row gap-3">
          {[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Completed", value: "completed" },
          ].map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <Pressable
                className={[
                  "rounded-full px-5 py-3",
                  isActive ? "bg-primary-900" : "bg-white",
                ].join(" ")}
                key={filter.value}
                onPress={() => setActiveFilter(filter.value as typeof activeFilter)}
              >
                <Text
                  className={[
                    "text-xs font-black uppercase tracking-[2px]",
                    isActive ? "text-white" : "text-primary-900",
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
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState description={error} title="Orders unavailable" />
      ) : filteredOrders.length === 0 ? (
        <ContractorEmptyState
          actionLabel="Start Bulk Order"
          description="No orders match this filter yet."
          onAction={() => router.push("/categories")}
          title="No orders found"
        />
      ) : (
        <View className="gap-4">
          {filteredOrders.map((order) => {
            const project = projects.find((item) => item.id === order.project_id);
            const orderStatus = getOrderStatusMeta(order.status);

            return (
              <View className="rounded-[28px] bg-white p-5" key={order.id}>
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-1">
                    <Text className="text-xl font-black text-primary-900">
                      Order #{order.id}
                    </Text>
                    <Text className="mt-1 text-sm font-medium text-neutral-500">
                      {project?.name ?? "Unassigned project"}
                    </Text>
                  </View>
                  <StatusPill
                    chipClassName={orderStatus.chipClassName}
                    label={orderStatus.label}
                  />
                </View>

                <View className="mt-5 flex-row items-center justify-between">
                  <View>
                    <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                      Total
                    </Text>
                    <Text className="mt-1 text-lg font-black text-accent-700">
                      {formatPhilippinePeso(order.total_amount)}
                    </Text>
                  </View>
                  <Text className="text-xs font-black uppercase tracking-[2px] text-neutral-400">
                    {formatDateTimeLabel(order.created_at)}
                  </Text>
                </View>

                <View className="mt-5 flex-row flex-wrap gap-3">
                  <Pressable
                    className="flex-1 items-center rounded-[20px] bg-primary-900 px-4 py-4 active:bg-primary-800"
                    onPress={() =>
                      router.push({
                        pathname: "/order-detail",
                        params: { order_id: order.id },
                      })
                    }
                  >
                    <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                      View Details
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 items-center rounded-[20px] border border-primary-900 px-4 py-4 active:bg-primary-50"
                    onPress={async () => {
                      if (!accessToken) {
                        return;
                      }

                      try {
                        const detail = await fetchOrderById(accessToken, order.id);
                        const reorderLines: ContractorOrderLine[] = [];

                        await Promise.all(
                          (detail.items ?? []).map(async (item) => {
                            try {
                              const product = await fetchProductById(item.product_id);
                              reorderLines.push({
                                imageUrl: product.image_url ?? null,
                                name: product.name ?? `Product ${item.product_id}`,
                                price: item.unit_price,
                                productId: item.product_id,
                                quantity: item.quantity,
                                stockQuantity:
                                  typeof product.stock_quantity === "number"
                                    ? product.stock_quantity
                                    : null,
                                unit: product.unit ?? "unit",
                              });
                            } catch {
                              reorderLines.push({
                                imageUrl: null,
                                name: `Product ${item.product_id}`,
                                price: item.unit_price,
                                productId: item.product_id,
                                quantity: item.quantity,
                                stockQuantity: null,
                                unit: "unit",
                              });
                            }
                          }),
                        );

                        reorderItems(reorderLines, order.project_id ?? null);
                        router.push("/cart");
                      } catch {
                        router.push({
                          pathname: "/order-detail",
                          params: { order_id: order.id },
                        });
                      }
                    }}
                  >
                    <Text className="text-xs font-black uppercase tracking-[2px] text-primary-900">
                      Reorder
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ContractorPage>
  );
}

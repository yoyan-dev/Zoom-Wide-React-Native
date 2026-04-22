import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { StatusPill } from "@/app/screens/contractor/components/StatusPill";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import {
  formatDateTimeLabel,
  getDeliveryMeta,
  getOrderStatusMeta,
} from "@/app/screens/contractor/utils";
import { fetchDeliveries } from "@/services/deliveriesApi";
import { fetchOrderById } from "@/services/ordersApi";
import { fetchProjectById } from "@/services/projectsApi";
import type { Delivery } from "@/types/delivery";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function ContractorOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ order_id?: string | string[] }>();
  const { accessToken } = useContractorSession();
  const orderId = Array.isArray(params.order_id) ? params.order_id[0] : params.order_id;
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Awaited<ReturnType<typeof fetchOrderById>> | null>(
    null,
  );
  const [project, setProject] = useState<Awaited<ReturnType<typeof fetchProjectById>> | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      if (!accessToken || !orderId) {
        setError("Order details are unavailable.");
        setIsLoading(false);
        return;
      }

      let isActive = true;
      setIsLoading(true);
      setError(null);

      void Promise.all([
        fetchOrderById(accessToken, orderId),
        fetchDeliveries(accessToken, { limit: 20, order_id: orderId }),
      ])
        .then(async ([nextOrder, nextDeliveries]) => {
          if (!isActive) {
            return;
          }

          setOrder(nextOrder);
          setDeliveries(nextDeliveries);

          if (nextOrder.project_id) {
            try {
              setProject(await fetchProjectById(accessToken, nextOrder.project_id));
            } catch {
              setProject(null);
            }
          }
        })
        .catch((loadError) => {
          if (!isActive) {
            return;
          }

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load order details.",
          );
        })
        .finally(() => {
          if (isActive) {
            setIsLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }, [accessToken, orderId]),
  );

  const latestDelivery = useMemo(
    () =>
      [...deliveries].sort(
        (left, right) =>
          new Date(right.updated_at).getTime() -
          new Date(left.updated_at).getTime(),
      )[0] ?? null,
    [deliveries],
  );

  return (
    <ContractorPage>
      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error || !order ? (
        <ContractorEmptyState
          actionLabel="Back"
          description={error || "This order could not be loaded."}
          onAction={() => router.back()}
          title="Order unavailable"
        />
      ) : (
        <>
          <View className="rounded-[32px] bg-primary-900 px-5 pb-5 pt-6">
            <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-300">
              Order details
            </Text>
            <Text className="mt-3 text-3xl font-black text-white">
              Order #{order.id}
            </Text>
            <Text className="mt-3 text-sm font-medium leading-6 text-primary-100">
              Linked project: {project?.name ?? order.project?.name ?? "Not assigned"}
            </Text>

            <View className="mt-6 flex-row flex-wrap gap-3">
              <View className="min-w-[120px] flex-1 rounded-[22px] bg-white/10 px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                  Status
                </Text>
                <Text className="mt-2 text-sm font-black text-white">
                  {getOrderStatusMeta(order.status).label}
                </Text>
              </View>
              <View className="min-w-[120px] flex-1 rounded-[22px] bg-white/10 px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                  Total
                </Text>
                <Text className="mt-2 text-sm font-black text-white">
                  {formatPhilippinePeso(order.total_amount)}
                </Text>
              </View>
            </View>

            <Pressable
              className="mt-6 items-center rounded-[22px] bg-accent-600 px-4 py-4 active:opacity-90"
              onPress={() =>
                router.push({
                  pathname: "/order-tracking",
                  params: { order_id: order.id },
                })
              }
            >
              <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                Track Delivery
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 rounded-[30px] bg-white p-5">
            <Text className="text-xl font-black text-primary-900">Items</Text>
            <View className="mt-4 gap-3">
              {(order.items ?? []).map((item) => (
                <View className="rounded-[22px] bg-[#F3F5F7] px-4 py-4" key={item.id}>
                  <View className="flex-row items-center justify-between gap-4">
                    <Text className="flex-1 text-sm font-black text-primary-900">
                      Product {item.product_id}
                    </Text>
                    <Text className="text-sm font-black text-primary-900">
                      x{item.quantity}
                    </Text>
                  </View>
                  <Text className="mt-2 text-sm font-medium text-neutral-500">
                    {formatPhilippinePeso(item.unit_price)} each
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-6 rounded-[30px] bg-white p-5">
            <Text className="text-xl font-black text-primary-900">Delivery Info</Text>
            <View className="mt-4 gap-4">
              <View className="rounded-[22px] bg-[#F3F5F7] px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                  Delivery Status
                </Text>
                <View className="mt-2">
                  <StatusPill
                    chipClassName={getDeliveryMeta(latestDelivery).chipClassName}
                    label={getDeliveryMeta(latestDelivery).label}
                  />
                </View>
              </View>
              <View className="rounded-[22px] bg-[#F3F5F7] px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                  ETA
                </Text>
                <Text className="mt-2 text-sm font-black text-primary-900">
                  {formatDateTimeLabel(latestDelivery?.scheduled_at ?? order.updated_at)}
                </Text>
              </View>
              <View className="rounded-[22px] bg-[#F3F5F7] px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                  Driver
                </Text>
                <Text className="mt-2 text-sm font-black text-primary-900">
                  {latestDelivery?.driver_id
                    ? `Driver ${latestDelivery.driver_id}`
                    : "Driver assignment pending"}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ContractorPage>
  );
}

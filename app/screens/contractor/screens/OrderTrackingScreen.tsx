import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { OrderTimeline } from "@/app/screens/contractor/components/OrderTimeline";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import {
  formatDateTimeLabel,
  getDeliveryForOrder,
} from "@/app/screens/contractor/utils";
import { fetchDeliveries } from "@/services/deliveriesApi";
import { fetchOrderById } from "@/services/ordersApi";
import type { Delivery } from "@/types/delivery";
import type { Order } from "@/types/order";

export function ContractorOrderTrackingScreen() {
  const params = useLocalSearchParams<{ order_id?: string | string[] }>();
  const { accessToken } = useContractorSession();
  const orderId = Array.isArray(params.order_id) ? params.order_id[0] : params.order_id;
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!accessToken || !orderId) {
      setError("Tracking details are unavailable.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    void Promise.all([
      fetchOrderById(accessToken, orderId),
      fetchDeliveries(accessToken, { limit: 20, order_id: orderId }),
    ])
      .then(([nextOrder, nextDeliveries]) => {
        if (!isMounted) {
          return;
        }

        setOrder(nextOrder);
        setDelivery(getDeliveryForOrder(nextDeliveries, nextOrder.id));
      })
      .catch((loadError) => {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tracking details.",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken, orderId]);

  return (
    <ContractorPage>
      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error || !order ? (
        <ContractorEmptyState
          description={error || "Tracking details could not be loaded."}
          title="Tracking unavailable"
        />
      ) : (
        <>
          <View className="rounded-[32px] bg-primary-900 px-5 pb-5 pt-6">
            <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-300">
              Delivery tracking
            </Text>
            <Text className="mt-3 text-3xl font-black text-white">Order #{order.id}</Text>
            <Text className="mt-3 text-sm font-medium leading-6 text-primary-100">
              ETA {formatDateTimeLabel(delivery?.scheduled_at ?? order.updated_at)}
            </Text>

            <View className="mt-6 flex-row flex-wrap gap-3">
              <View className="min-w-[120px] flex-1 rounded-[22px] bg-white/10 px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                  Driver
                </Text>
                <Text className="mt-2 text-sm font-black text-white">
                  {delivery?.driver_id ? `Driver ${delivery.driver_id}` : "Pending"}
                </Text>
              </View>
              <View className="min-w-[120px] flex-1 rounded-[22px] bg-white/10 px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                  Vehicle
                </Text>
                <Text className="mt-2 text-sm font-black text-white">
                  {delivery?.vehicle_number ?? "To be assigned"}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <ContractorSectionHeader
              subtitle="Clear site-facing milestones from approval through final drop-off."
              title="Tracking Timeline"
            />
            <OrderTimeline delivery={delivery} order={order} />
          </View>
        </>
      )}
    </ContractorPage>
  );
}

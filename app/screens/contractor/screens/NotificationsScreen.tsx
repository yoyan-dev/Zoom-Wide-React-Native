import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { NotificationCard } from "@/app/screens/contractor/components/NotificationCard";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import { buildContractorNotifications } from "@/app/screens/contractor/utils";
import type { ContractorNotification } from "@/app/screens/contractor/types";
import { fetchDeliveries } from "@/services/deliveriesApi";
import { fetchOrders } from "@/services/ordersApi";
import { fetchProjects } from "@/services/projectsApi";

export function ContractorNotificationsScreen() {
  const { accessToken, customer } = useContractorSession();
  const [notifications, setNotifications] = useState<ContractorNotification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!accessToken || !customer?.id) {
        setError("Sign in to view contractor notifications.");
        setIsLoading(false);
        return;
      }

      let isActive = true;
      setIsLoading(true);
      setError(null);

      void Promise.all([
        fetchOrders(accessToken, { customer_id: customer.id, limit: 20 }),
        fetchProjects(accessToken, { limit: 20 }),
      ])
        .then(async ([orders, projects]) => {
          const deliveryGroups = await Promise.all(
            orders
              .slice(0, 10)
              .map((order) => fetchDeliveries(accessToken, { limit: 3, order_id: order.id })),
          );

          if (!isActive) {
            return;
          }

          setNotifications(
            buildContractorNotifications(orders, deliveryGroups.flat(), projects),
          );
        })
        .catch((loadError) => {
          if (!isActive) {
            return;
          }

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load notifications.",
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
    }, [accessToken, customer?.id]),
  );

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Recent order approvals, dispatch updates, and project reminders."
        title="Notifications"
      />

      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState description={error} title="Notifications unavailable" />
      ) : notifications.length === 0 ? (
        <ContractorEmptyState
          description="There are no contractor notifications yet."
          title="All caught up"
        />
      ) : (
        <View className="gap-4">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </View>
      )}
    </ContractorPage>
  );
}

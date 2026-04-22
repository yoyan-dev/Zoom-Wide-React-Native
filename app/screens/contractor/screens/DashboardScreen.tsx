import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { ActionCard } from "@/app/screens/contractor/components/ActionCard";
import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { NotificationCard } from "@/app/screens/contractor/components/NotificationCard";
import { ProjectCard } from "@/app/screens/contractor/components/ProjectCard";
import { StatCard } from "@/app/screens/contractor/components/StatCard";
import { StatusPill } from "@/app/screens/contractor/components/StatusPill";
import { PROJECT_STATUS_META } from "@/app/screens/contractor/constants";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import {
  buildContractorNotifications,
  formatDateLabel,
  getContractorGreeting,
  getDeliveryForOrder,
} from "@/app/screens/contractor/utils";
import { fetchDeliveries } from "@/services/deliveriesApi";
import { fetchOrders } from "@/services/ordersApi";
import { fetchProjects } from "@/services/projectsApi";
import type { Delivery } from "@/types/delivery";
import type { Order } from "@/types/order";
import type { Project } from "@/types/project";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function ContractorDashboardScreen() {
  const router = useRouter();
  const { accessToken, customer, user } = useContractorSession();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadDashboard = useCallback(async () => {
    if (!accessToken || !customer?.id) {
      setError("Sign in with a contractor account to view the dashboard.");
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const [nextProjects, nextOrders] = await Promise.all([
        fetchProjects(accessToken, { limit: 10 }),
        fetchOrders(accessToken, { customer_id: customer.id, limit: 10 }),
      ]);

      const activeOrderIds = nextOrders.map((order) => order.id);
      const nextDeliveries =
        activeOrderIds.length > 0
          ? await Promise.all(
              activeOrderIds.map((orderId) =>
                fetchDeliveries(accessToken, {
                  limit: 1,
                  order_id: orderId,
                }),
              ),
            ).then((response) => response.flat())
          : [];

      setProjects(nextProjects);
      setOrders(nextOrders);
      setDeliveries(nextDeliveries);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load contractor dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, customer?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
    }, [loadDashboard]),
  );

  const notifications = useMemo(
    () => buildContractorNotifications(orders, deliveries, projects),
    [deliveries, orders, projects],
  );
  const ongoingOrders = useMemo(
    () => orders.filter((order) => order.status !== "completed").slice(0, 3),
    [orders],
  );

  return (
    <ContractorPage>
      <View className="overflow-hidden rounded-sm">
        <View className="bg-primary-600 px-5 pb-16 pt-6 rounded-[16px]">
          <Text className="text-[11px] font-black uppercase tracking-[3px] text-white/60">
            Dashboard
          </Text>

          <Text className="mt-3 text-3xl font-black text-white">
            {getContractorGreeting(customer?.contact_name || user?.full_name)}
          </Text>

          <Text className="mt-2 text-sm text-white/70">
            Manage projects, orders, and deliveries in one place.
          </Text>
        </View>
      </View>

      <View className="-mt-10 flex-row gap-3 px-4">
        <StatCard label="Projects" value={String(projects.length)} />
        <StatCard
          label="Active Orders"
          value={String(
            orders.filter((order) => order.status !== "completed").length,
          )}
        />
        <StatCard
          label="Spend"
          value={formatPhilippinePeso(
            orders.reduce((sum, order) => sum + (order.total_amount ?? 0), 0),
          )}
        />
      </View>

      <View className="mt-6">
        <ContractorSectionHeader
          actionLabel="View all"
          onAction={() => router.push("/projects")}
          subtitle="Switch sites quickly and keep materials tied to the right job."
          title="Active Projects"
        />

        {isLoading ? (
          <View className="rounded-[16px] bg-white p-6">
            <ActivityIndicator color="#0A2238" />
          </View>
        ) : error ? (
          <ContractorEmptyState
            actionLabel="Retry"
            description={error}
            onAction={() => void loadDashboard()}
            title="Dashboard unavailable"
          />
        ) : projects.length === 0 ? (
          <ContractorEmptyState
            actionLabel="Create Project"
            description="Add your first site so you can start preparing bulk material orders."
            onAction={() => router.push("/project-form")}
            title="No projects yet"
          />
        ) : (
          <ScrollView
            className="-mx-1"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-col gap-4  px-1">
              {projects.slice(0, 5).map((project) => (
                <ProjectCard
                  key={project.id}
                  onPress={() =>
                    router.push({
                      pathname: "/project-detail",
                      params: { project_id: project.id },
                    })
                  }
                  project={project}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <View className="mt-8 rounded-[16px] bg-white p-5">
        <Text className="text-xl font-black text-primary-900">
          Quick Actions
        </Text>
        <View className="mt-4 flex-row flex-wrap gap-3">
          <ActionCard
            icon="add-business"
            label="Create Project"
            color="#fff"
            className="bg-primary-600 text-white"
            onPress={() => router.push("/project-form")}
          />
          <ActionCard
            icon="inventory-2"
            label="Bulk Order"
            color="#fff"
            className="bg-accent-600 text-white"
            onPress={() => router.push("/categories")}
          />
          <ActionCard
            icon="notifications-active"
            label="Alerts"
            color=""
            className="bg-[#F3F5F7]"
            onPress={() => router.push("/notifications")}
          />
        </View>
      </View>

      <View className="mt-8">
        <ContractorSectionHeader
          actionLabel="Orders"
          onAction={() => router.push("/orders")}
          subtitle="Fast visibility into jobs already in motion."
          title="Ongoing Orders"
        />
        <View className="gap-3">
          {ongoingOrders.length === 0 ? (
            <ContractorEmptyState
              actionLabel="Browse Materials"
              description="As soon as you place a contractor order, it will appear here with delivery status."
              onAction={() => router.push("/categories")}
              title="No ongoing orders"
            />
          ) : (
            ongoingOrders.map((order) => {
              const project = projects.find(
                (item) => item.id === order.project_id,
              );
              const delivery = getDeliveryForOrder(deliveries, order.id);

              return (
                <Pressable
                  className="rounded-[26px] bg-white p-5 active:opacity-85"
                  key={order.id}
                  onPress={() =>
                    router.push({
                      pathname: "/order-detail",
                      params: { order_id: order.id },
                    })
                  }
                >
                  <View className="flex-row items-start justify-between gap-4">
                    <View className="flex-1">
                      <Text className="text-lg font-black text-primary-900">
                        Order #{order.id}
                      </Text>
                      <Text className="mt-1 text-sm font-medium text-neutral-500">
                        {project?.name ?? "Unassigned project"}
                      </Text>
                    </View>
                    <StatusPill
                      chipClassName={PROJECT_STATUS_META.active.chipClassName}
                      label={delivery ? "In Motion" : "Pending"}
                    />
                  </View>
                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-neutral-500">
                      ETA{" "}
                      {formatDateLabel(
                        delivery?.scheduled_at ?? order.updated_at,
                      )}
                    </Text>
                    <Text className="text-base font-black text-accent-700">
                      {formatPhilippinePeso(order.total_amount)}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </View>

      <View className="mt-8">
        <ContractorSectionHeader
          actionLabel="See all"
          onAction={() => router.push("/notifications")}
          subtitle="Recent order and delivery updates."
          title="Notifications"
        />
        <View className="gap-3">
          {notifications.length === 0 ? (
            <ContractorEmptyState
              description="You are all caught up. New approvals and delivery updates will appear here."
              title="No notifications"
            />
          ) : (
            notifications.map((notification) => (
              <Pressable
                key={notification.id}
                onPress={() => router.push("/notifications")}
              >
                <NotificationCard notification={notification} />
              </Pressable>
            ))
          )}
        </View>
      </View>
    </ContractorPage>
  );
}

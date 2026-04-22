import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { StatusPill } from "@/app/screens/contractor/components/StatusPill";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import {
  formatDateLabel,
  formatDateTimeLabel,
  getOrderStatusMeta,
  getProjectStatusLabel,
} from "@/app/screens/contractor/utils";
import { fetchOrders } from "@/services/ordersApi";
import { fetchProjectById } from "@/services/projectsApi";
import { useContractorOrderStore } from "@/store/contractorOrderStore";
import type { Order } from "@/types/order";
import type { Project } from "@/types/project";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function ContractorProjectDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ project_id?: string | string[] }>();
  const { accessToken, customer } = useContractorSession();
  const projectId = Array.isArray(params.project_id)
    ? params.project_id[0]
    : params.project_id;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const loadProject = useCallback(async () => {
    if (!accessToken || !customer?.id || !projectId) {
      setError("Project details are unavailable.");
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const [nextProject, nextOrders] = await Promise.all([
        fetchProjectById(accessToken, projectId),
        fetchOrders(accessToken, { customer_id: customer.id, limit: 100 }),
      ]);

      setProject(nextProject);
      setOrders(
        nextOrders.filter((order) => order.project_id === nextProject.id),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load project details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, customer?.id, projectId]);

  useFocusEffect(
    useCallback(() => {
      void loadProject();
    }, [loadProject]),
  );

  return (
    <ContractorPage>
      {isLoading ? (
        <View className="rounded-[16px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error || !project ? (
        <ContractorEmptyState
          actionLabel="Back"
          description={error || "The requested project could not be found."}
          onAction={() => router.back()}
          title="Project unavailable"
        />
      ) : (
        <>
          <View className="rounded-[16px] bg-primary-600 px-5 pb-5 pt-6">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-300">
                  Project details
                </Text>
                <Text className="mt-3 text-3xl font-black text-white">
                  {project.name}
                </Text>
                <Text className="mt-3 text-sm font-medium leading-6 text-primary-100">
                  {project.location ?? "Location pending"}
                </Text>
              </View>
              <StatusPill
                chipClassName="bg-white/15"
                label={getProjectStatusLabel(project.status)}
                textClassName="text-white"
              />
            </View>

            <View className="mt-6 flex-row flex-wrap gap-3">
              <View className="min-w-[120px] flex-1 rounded-[16px] bg-white/10 px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                  Timeline
                </Text>
                <Text className="mt-2 text-sm font-black text-white">
                  {formatDateLabel(project.start_date)} -{" "}
                  {formatDateLabel(project.end_date)}
                </Text>
              </View>
              <View className="min-w-[120px] flex-1 rounded-[16px] bg-white/10 px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                  Progress
                </Text>
                <Text className="mt-2 text-sm font-black text-white">
                  {project.progress ?? 0}%
                </Text>
              </View>
            </View>

            {project.description ? (
              <Text className="mt-5 text-sm font-medium leading-6 text-primary-100">
                {project.description}
              </Text>
            ) : null}

            <View className="mt-6 flex-row gap-3">
              <Pressable
                className="flex-1 items-center rounded-[20px] bg-accent-600 px-4 py-4 active:opacity-90"
                onPress={() => {
                  useContractorOrderStore.getState().setProject(project.id);
                  router.push({
                    pathname: "/products",
                    params: { project_id: project.id },
                  });
                }}
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                  Order Materials
                </Text>
              </Pressable>
              <Pressable
                className="items-center rounded-[20px] border border-white/30 px-4 py-4 active:bg-white/10"
                onPress={() =>
                  router.push({
                    pathname: "/project-form",
                    params: { project_id: project.id },
                  })
                }
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                  Edit
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-8">
            <ContractorSectionHeader
              subtitle="Orders linked to this job for easier reconciliation."
              title="Linked Orders"
            />
            <View className="gap-3">
              {orders.length === 0 ? (
                <ContractorEmptyState
                  actionLabel="Start Order"
                  description="No material orders are linked to this project yet."
                  onAction={() => {
                    useContractorOrderStore.getState().setProject(project.id);
                    router.push({
                      pathname: "/products",
                      params: { project_id: project.id },
                    });
                  }}
                  title="No linked orders"
                />
              ) : (
                orders.map((order) => (
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
                    <View className="flex-row items-center justify-between gap-4">
                      <View>
                        <Text className="text-lg font-black text-primary-900">
                          Order #{order.id}
                        </Text>
                        <Text className="mt-1 text-sm font-medium text-neutral-500">
                          {formatDateTimeLabel(order.created_at)}
                        </Text>
                      </View>
                      <StatusPill
                        chipClassName={
                          getOrderStatusMeta(order.status).chipClassName
                        }
                        label={getOrderStatusMeta(order.status).label}
                      />
                    </View>
                    <Text className="mt-4 text-base font-black text-accent-700">
                      {formatPhilippinePeso(order.total_amount)}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        </>
      )}
    </ContractorPage>
  );
}

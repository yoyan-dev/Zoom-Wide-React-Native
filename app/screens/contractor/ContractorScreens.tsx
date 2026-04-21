import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { fetchCategories } from "@/services/categoriesApi";
import { fetchDeliveries } from "@/services/deliveriesApi";
import { createOrder, fetchOrderById, fetchOrders } from "@/services/ordersApi";
import {
  createProject,
  fetchProjectById,
  fetchProjects,
  updateProject,
} from "@/services/projectsApi";
import { fetchProductById, fetchProducts } from "@/services/productsApi";
import { useAuthStore } from "@/store/authStore";
import {
  type ContractorOrderLine,
  type ContractorPaymentMethod,
  useContractorOrderStore,
} from "@/store/contractorOrderStore";
import type { Category } from "@/types/category";
import type { Delivery } from "@/types/delivery";
import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { Project } from "@/types/project";
import { isContractorCustomer } from "@/utils/customerAccess";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

type ContractorNotification = {
  id: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warning";
  dateLabel: string;
};

const PAYMENT_OPTIONS: Array<{
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: ContractorPaymentMethod;
}> = [
  {
    description: "Fast confirmation for online project payments.",
    icon: "account-balance-wallet",
    label: "GCash",
    value: "gcash",
  },
  {
    description: "Settle payment when the materials arrive on site.",
    icon: "payments",
    label: "Cash",
    value: "cash",
  },
  {
    description: "Use your company or personal card for checkout.",
    icon: "credit-card",
    label: "Card",
    value: "card",
  },
];

const PROJECT_STATUS_META: Record<
  Project["status"],
  { chipClassName: string; label: string }
> = {
  active: { chipClassName: "bg-emerald-100 text-emerald-700", label: "Active" },
  cancelled: {
    chipClassName: "bg-rose-100 text-rose-700",
    label: "Cancelled",
  },
  completed: {
    chipClassName: "bg-sky-100 text-sky-700",
    label: "Completed",
  },
  on_hold: { chipClassName: "bg-amber-100 text-amber-700", label: "On Hold" },
};

function formatDateLabel(value?: string | null) {
  if (!value) {
    return "Not scheduled";
  }

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

function formatDateTimeLabel(value?: string | null) {
  if (!value) {
    return "Pending update";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-PH", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderStatusMeta(status: OrderStatus) {
  switch (status) {
    case "approved":
      return { chipClassName: "bg-sky-100 text-sky-700", label: "Approved" };
    case "cancelled":
      return { chipClassName: "bg-neutral-200 text-neutral-600", label: "Cancelled" };
    case "completed":
      return { chipClassName: "bg-emerald-100 text-emerald-700", label: "Completed" };
    case "rejected":
      return { chipClassName: "bg-rose-100 text-rose-700", label: "Rejected" };
    default:
      return { chipClassName: "bg-amber-100 text-amber-700", label: "Pending" };
  }
}

function getDeliveryMeta(delivery: Delivery | null) {
  switch (delivery?.status) {
    case "delivered":
      return { chipClassName: "bg-emerald-100 text-emerald-700", label: "Delivered" };
    case "in_transit":
      return { chipClassName: "bg-sky-100 text-sky-700", label: "Out for Delivery" };
    case "scheduled":
      return { chipClassName: "bg-amber-100 text-amber-700", label: "Preparing" };
    case "cancelled":
      return { chipClassName: "bg-neutral-200 text-neutral-600", label: "Cancelled" };
    case "failed":
      return { chipClassName: "bg-rose-100 text-rose-700", label: "Failed" };
    default:
      return { chipClassName: "bg-neutral-200 text-neutral-600", label: "Pending" };
  }
}

function getContractorGreeting(name: string | null | undefined) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return `${greeting}, ${name?.trim() || "Contractor"}`;
}

function getProjectStatusLabel(status: Project["status"]) {
  return PROJECT_STATUS_META[status]?.label ?? "Active";
}

function getDeliveryForOrder(deliveries: Delivery[], orderId: string) {
  const filtered = deliveries.filter((delivery) => delivery.order_id === orderId);
  return filtered.sort(
    (left, right) =>
      new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
  )[0] ?? null;
}

function buildContractorNotifications(
  orders: Order[],
  deliveries: Delivery[],
  projects: Project[],
) {
  const notifications: ContractorNotification[] = [];

  orders.slice(0, 3).forEach((order) => {
    const delivery = getDeliveryForOrder(deliveries, order.id);
    const project = projects.find((item) => item.id === order.project_id);

    notifications.push({
      body: delivery
        ? `${getDeliveryMeta(delivery).label} for ${project?.name ?? "your project"}`
        : `Order ${getOrderStatusMeta(order.status).label.toLowerCase()} for ${project?.name ?? "your project"}`,
      dateLabel: formatDateTimeLabel(delivery?.updated_at ?? order.updated_at),
      id: `order-${order.id}`,
      title: `Order #${order.id}`,
      tone:
        order.status === "completed" || delivery?.status === "delivered"
          ? "success"
          : order.status === "rejected"
            ? "warning"
            : "info",
    });
  });

  projects
    .filter((project) => project.end_date)
    .sort(
      (left, right) =>
        new Date(left.end_date ?? "").getTime() - new Date(right.end_date ?? "").getTime(),
    )
    .slice(0, 2)
    .forEach((project) => {
      notifications.push({
        body: `Target completion ${formatDateLabel(project.end_date)} for ${project.location ?? "site delivery planning"}.`,
        dateLabel: formatDateLabel(project.end_date),
        id: `project-${project.id}`,
        title: `${project.name} timeline`,
        tone: "info",
      });
    });

  return notifications.slice(0, 5);
}

function ContractorEmptyState({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <View className="rounded-[28px] border border-dashed border-neutral-300 bg-white px-5 py-6">
      <Text className="text-lg font-black text-primary-900">{title}</Text>
      <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          className="mt-5 self-start rounded-2xl bg-primary-900 px-4 py-3 active:bg-primary-800"
          onPress={onAction}
        >
          <Text className="text-xs font-black uppercase tracking-[2px] text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ContractorSectionHeader({
  actionLabel,
  onAction,
  subtitle,
  title,
}: {
  actionLabel?: string;
  onAction?: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <View className="mb-4 flex-row items-end justify-between gap-4">
      <View className="flex-1">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-700">
          Contractor Workspace
        </Text>
        <Text className="mt-1 text-2xl font-black tracking-tight text-primary-900">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          className="rounded-2xl border border-primary-900 px-4 py-3 active:bg-primary-50"
          onPress={onAction}
        >
          <Text className="text-[11px] font-black uppercase tracking-[2px] text-primary-900">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ContractorPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ScrollView
      className="flex-1 bg-[#F3F5F7]"
      contentContainerClassName="px-5 pb-32 pt-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-screen-md">{children}</View>
    </ScrollView>
  );
}

function MaterialCard({
  onPress,
  product,
}: {
  onPress: () => void;
  product: Product;
}) {
  return (
    <Pressable
      className="w-[48%] rounded-[26px] bg-white p-3 active:opacity-85"
      onPress={onPress}
      style={{
        elevation: 4,
        shadowColor: "#091C2A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      }}
    >
      <View className="h-32 overflow-hidden rounded-[18px] bg-neutral-100">
        {product.image_url ? (
          <Image
            className="h-full w-full"
            resizeMode="cover"
            source={{ uri: product.image_url }}
          />
        ) : (
          <View className="h-full items-center justify-center bg-primary-50">
            <MaterialIcons color="#0A2238" name="inventory-2" size={34} />
          </View>
        )}
      </View>
      <Text className="mt-3 text-sm font-black leading-5 text-primary-900">
        {product.name ?? "Material"}
      </Text>
      <Text className="mt-1 text-xs font-semibold uppercase tracking-[2px] text-neutral-500">
        {product.unit ?? "unit"} • Stock {product.stock_quantity ?? 0}
      </Text>
      <View className="mt-3 flex-row items-center justify-between gap-3">
        <Text className="text-base font-black text-accent-700">
          {formatPhilippinePeso(product.price ?? 0)}
        </Text>
        <View className="rounded-full bg-primary-900 px-3 py-2">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-white">
            Bulk
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function OrderTimeline({
  delivery,
  order,
}: {
  delivery: Delivery | null;
  order: Order;
}) {
  const steps = [
    {
      complete: true,
      description: "Your bulk request has been submitted to the supplier.",
      title: "Pending",
      when: formatDateTimeLabel(order.created_at),
    },
    {
      complete: order.status !== "pending",
      description: "The supplier has reviewed your project order.",
      title: "Approved",
      when:
        order.status === "approved" ||
        order.status === "completed" ||
        delivery?.status
          ? formatDateTimeLabel(order.updated_at)
          : "Awaiting approval",
    },
    {
      complete:
        delivery?.status === "scheduled" ||
        delivery?.status === "in_transit" ||
        delivery?.status === "delivered",
      description: "Materials are being picked, packed, and assigned.",
      title: "Preparing",
      when: delivery?.scheduled_at
        ? formatDateTimeLabel(delivery.scheduled_at)
        : "Schedule pending",
    },
    {
      complete: delivery?.status === "in_transit" || delivery?.status === "delivered",
      description: "Your load is already on the road to the site.",
      title: "Out for Delivery",
      when:
        delivery?.status === "in_transit" || delivery?.status === "delivered"
          ? formatDateTimeLabel(delivery.updated_at)
          : "Driver not dispatched yet",
    },
    {
      complete: delivery?.status === "delivered" || order.status === "completed",
      description: "Delivery completed and acknowledged on site.",
      title: "Delivered",
      when:
        delivery?.status === "delivered"
          ? formatDateTimeLabel(delivery.delivered_at)
          : "Pending arrival",
    },
  ];

  return (
    <View className="rounded-[28px] bg-white p-5">
      {steps.map((step, index) => (
        <View className="flex-row gap-4" key={step.title}>
          <View className="items-center">
            <View
              className={[
                "h-9 w-9 items-center justify-center rounded-full",
                step.complete ? "bg-primary-900" : "bg-neutral-200",
              ].join(" ")}
            >
              <MaterialIcons
                color={step.complete ? "#FFFFFF" : "#667080"}
                name={step.complete ? "check" : "radio-button-unchecked"}
                size={18}
              />
            </View>
            {index < steps.length - 1 ? (
              <View className="my-1 h-12 w-[2px] bg-neutral-200" />
            ) : null}
          </View>
          <View className="flex-1 pb-6">
            <Text className="text-base font-black text-primary-900">{step.title}</Text>
            <Text className="mt-1 text-xs font-black uppercase tracking-[2px] text-neutral-400">
              {step.when}
            </Text>
            <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
              {step.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function useContractorSession() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const customer = useAuthStore((state) => state.customer);
  const user = useAuthStore((state) => state.user);

  return {
    accessToken,
    customer,
    isContractor: isContractorCustomer(customer),
    user,
  };
}

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
      <View className="rounded-[32px] bg-primary-900 px-5 pb-5 pt-6">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-300">
          Contractor dashboard
        </Text>
        <Text className="mt-3 text-3xl font-black leading-tight text-white">
          {getContractorGreeting(
            customer?.company_name || customer?.contact_name || user?.full_name,
          )}
        </Text>
        <Text className="mt-3 text-sm font-medium leading-6 text-primary-100">
          Manage project-based supply runs, place bulk orders, and monitor site
          deliveries from one workspace.
        </Text>

        <View className="mt-6 flex-row flex-wrap gap-3">
          {[
            { label: "Projects", value: String(projects.length) },
            {
              label: "Active Orders",
              value: String(
                orders.filter((order) => order.status !== "completed").length,
              ),
            },
            {
              label: "Spend",
              value: formatPhilippinePeso(
                orders.reduce((sum, order) => sum + (order.total_amount ?? 0), 0),
              ),
            },
          ].map((metric) => (
            <View
              className="min-w-[95px] flex-1 rounded-[24px] bg-white/10 px-4 py-4"
              key={metric.label}
            >
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                {metric.label}
              </Text>
              <Text className="mt-2 text-2xl font-black text-white">{metric.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6">
        <ContractorSectionHeader
          actionLabel="View all"
          onAction={() => router.push("/projects")}
          subtitle="Switch sites quickly and keep materials tied to the right job."
          title="Active Projects"
        />

        {isLoading ? (
          <View className="rounded-[28px] bg-white p-6">
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
            <View className="flex-row gap-4 px-1">
              {projects.slice(0, 5).map((project) => (
                <Pressable
                  className="w-72 rounded-[28px] bg-white p-5 active:opacity-85"
                  key={project.id}
                  onPress={() =>
                    router.push({
                      pathname: "/project-detail",
                      params: { project_id: project.id },
                    })
                  }
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-lg font-black text-primary-900">
                        {project.name}
                      </Text>
                      <Text className="mt-1 text-sm font-medium text-neutral-500">
                        {project.location ?? "Location pending"}
                      </Text>
                    </View>
                    <View
                      className={`rounded-full px-3 py-2 ${PROJECT_STATUS_META[project.status].chipClassName}`}
                    >
                      <Text className="text-[10px] font-black uppercase tracking-[2px]">
                        {getProjectStatusLabel(project.status)}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-6 rounded-[20px] bg-[#F3F5F7] p-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[11px] font-black uppercase tracking-[2px] text-neutral-400">
                        Progress
                      </Text>
                      <Text className="text-sm font-black text-primary-900">
                        {project.progress ?? 0}%
                      </Text>
                    </View>
                    <View className="mt-3 h-2 rounded-full bg-neutral-200">
                      <View
                        className="h-2 rounded-full bg-accent-600"
                        style={{ width: `${Math.min(project.progress ?? 0, 100)}%` }}
                      />
                    </View>
                    <Text className="mt-4 text-xs font-semibold uppercase tracking-[2px] text-neutral-500">
                      Due {formatDateLabel(project.end_date)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <View className="mt-8 rounded-[30px] bg-white p-5">
        <Text className="text-xl font-black text-primary-900">Quick Actions</Text>
        <View className="mt-4 flex-row flex-wrap gap-3">
          {[
            {
              icon: "add-business",
              label: "Create Project",
              onPress: () => router.push("/project-form"),
            },
            {
              icon: "inventory-2",
              label: "Bulk Order",
              onPress: () => router.push("/categories"),
            },
            {
              icon: "notifications-active",
              label: "Alerts",
              onPress: () => router.push("/notifications"),
            },
          ].map((action) => (
            <Pressable
              className="min-w-[140px] flex-1 rounded-[22px] bg-[#F3F5F7] px-4 py-5 active:bg-neutral-200"
              key={action.label}
              onPress={action.onPress}
            >
              <MaterialIcons color="#0A2238" name={action.icon as never} size={22} />
              <Text className="mt-3 text-sm font-black uppercase tracking-[2px] text-primary-900">
                {action.label}
              </Text>
            </Pressable>
          ))}
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
              const project = projects.find((item) => item.id === order.project_id);
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
                    <View className={`rounded-full px-3 py-2 ${getDeliveryMeta(delivery).chipClassName}`}>
                      <Text className="text-[10px] font-black uppercase tracking-[2px]">
                        {getDeliveryMeta(delivery).label}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-neutral-500">
                      ETA {formatDateLabel(delivery?.scheduled_at ?? order.updated_at)}
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
                className="rounded-[24px] bg-white px-4 py-4 active:opacity-85"
                key={notification.id}
                onPress={() => router.push("/notifications")}
              >
                <Text className="text-sm font-black text-primary-900">
                  {notification.title}
                </Text>
                <Text className="mt-1 text-sm font-medium leading-6 text-neutral-500">
                  {notification.body}
                </Text>
                <Text className="mt-2 text-[11px] font-black uppercase tracking-[2px] text-neutral-400">
                  {notification.dateLabel}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </View>
    </ContractorPage>
  );
}

export function ContractorProjectsScreen() {
  const router = useRouter();
  const { accessToken, customer } = useContractorSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = useCallback(async () => {
    if (!accessToken || !customer?.id) {
      setError("Sign in with a contractor account to manage projects.");
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      setProjects(await fetchProjects(accessToken, { limit: 50 }));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, customer?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadProjects();
    }, [loadProjects]),
  );

  return (
    <ContractorPage>
      <ContractorSectionHeader
        actionLabel="+ Add Project"
        onAction={() => router.push("/project-form")}
        subtitle="Every contractor order should roll up to a live site for cleaner purchasing and delivery visibility."
        title="Projects"
      />

      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState
          actionLabel="Retry"
          description={error}
          onAction={() => void loadProjects()}
          title="Project list unavailable"
        />
      ) : projects.length === 0 ? (
        <ContractorEmptyState
          actionLabel="Create Project"
          description="Add your first project before preparing a bulk order."
          onAction={() => router.push("/project-form")}
          title="No projects found"
        />
      ) : (
        <View className="gap-4">
          {projects.map((project) => (
            <Pressable
              className="rounded-[28px] bg-white p-5 active:opacity-85"
              key={project.id}
              onPress={() =>
                router.push({
                  pathname: "/project-detail",
                  params: { project_id: project.id },
                })
              }
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-xl font-black text-primary-900">
                    {project.name}
                  </Text>
                  <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
                    {project.location ?? "Location to be confirmed"}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-2 ${PROJECT_STATUS_META[project.status].chipClassName}`}
                >
                  <Text className="text-[10px] font-black uppercase tracking-[2px]">
                    {getProjectStatusLabel(project.status)}
                  </Text>
                </View>
              </View>

              <View className="mt-5 flex-row flex-wrap gap-3">
                <View className="min-w-[120px] flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4">
                  <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                    Timeline
                  </Text>
                  <Text className="mt-2 text-sm font-black text-primary-900">
                    {formatDateLabel(project.start_date)} - {formatDateLabel(project.end_date)}
                  </Text>
                </View>
                <View className="min-w-[120px] flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4">
                  <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                    Progress
                  </Text>
                  <Text className="mt-2 text-sm font-black text-primary-900">
                    {project.progress ?? 0}%
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ContractorPage>
  );
}

export function ContractorProjectFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ project_id?: string | string[] }>();
  const { accessToken } = useContractorSession();
  const projectId = Array.isArray(params.project_id)
    ? params.project_id[0]
    : params.project_id;
  const isEditing = Boolean(projectId);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState({
    budget: "",
    description: "",
    end_date: "",
    location: "",
    name: "",
    progress: "",
    start_date: "",
  });

  useEffect(() => {
    if (!accessToken || !projectId) {
      return;
    }

    let isMounted = true;

    void fetchProjectById(accessToken, projectId)
      .then((project) => {
        if (!isMounted) {
          return;
        }

        setValues({
          budget: project.budget ? String(project.budget) : "",
          description: project.description ?? "",
          end_date: project.end_date ?? "",
          location: project.location ?? "",
          name: project.name,
          progress:
            typeof project.progress === "number" ? String(project.progress) : "",
          start_date: project.start_date ?? "",
        });
      })
      .catch((loadError) => {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project details.",
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
  }, [accessToken, projectId]);

  const handleChange = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!accessToken || isSaving) {
      return;
    }

    if (!values.name.trim()) {
      setError("Project name is required.");
      return;
    }

    setError(null);
    setIsSaving(true);

    const payload = {
      budget: values.budget ? Number(values.budget) : undefined,
      description: values.description.trim() || undefined,
      end_date: values.end_date.trim() || undefined,
      location: values.location.trim() || undefined,
      name: values.name.trim(),
      progress: values.progress ? Number(values.progress) : undefined,
      start_date: values.start_date.trim() || undefined,
      status: "active" as const,
    };

    try {
      const project = isEditing && projectId
        ? await updateProject(accessToken, projectId, payload)
        : await createProject(accessToken, payload);

      router.replace({
        pathname: "/project-detail",
        params: { project_id: project.id },
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Capture the essentials for site-based material planning. Use ISO dates such as 2026-05-01."
        title={isEditing ? "Edit Project" : "Create Project"}
      />

      <View className="rounded-[30px] bg-white p-5">
        {isLoading ? (
          <View className="py-8">
            <ActivityIndicator color="#0A2238" />
          </View>
        ) : (
          <View className="gap-4">
            {[
              ["name", "Project Name", "North Wing Retrofit"],
              ["location", "Location", "Cebu City, Lot 18"],
              ["start_date", "Start Date", "2026-05-01"],
              ["end_date", "End Date", "2026-08-30"],
              ["progress", "Progress (%)", "42"],
              ["budget", "Budget", "2500000"],
            ].map(([field, label, placeholder]) => (
              <View key={field}>
                <Text className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
                  {label}
                </Text>
                <TextInput
                  className="rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
                  onChangeText={(value) =>
                    handleChange(field as keyof typeof values, value)
                  }
                  placeholder={placeholder}
                  placeholderTextColor="#94A3B8"
                  value={values[field as keyof typeof values]}
                />
              </View>
            ))}

            <View>
              <Text className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
                Description
              </Text>
              <TextInput
                className="min-h-[120px] rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
                multiline
                onChangeText={(value) => handleChange("description", value)}
                placeholder="Scope, delivery restrictions, staging notes..."
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                value={values.description}
              />
            </View>

            {error ? (
              <View className="rounded-[18px] bg-rose-50 px-4 py-3">
                <Text className="text-sm font-semibold text-rose-700">{error}</Text>
              </View>
            ) : null}

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 items-center rounded-[20px] bg-primary-900 px-4 py-4 active:bg-primary-800"
                onPress={() => void handleSave()}
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                  {isSaving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
                </Text>
              </Pressable>
              <Pressable
                className="items-center rounded-[20px] border border-neutral-300 px-4 py-4 active:bg-neutral-100"
                onPress={() => router.back()}
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-primary-900">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ContractorPage>
  );
}

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
      setOrders(nextOrders.filter((order) => order.project_id === nextProject.id));
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
        <View className="rounded-[28px] bg-white p-8">
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
          <View className="rounded-[32px] bg-primary-900 px-5 pb-5 pt-6">
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
              <View
                className="rounded-full bg-white/15 px-3 py-2"
              >
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-white">
                  {getProjectStatusLabel(project.status)}
                </Text>
              </View>
            </View>

            <View className="mt-6 flex-row flex-wrap gap-3">
              <View className="min-w-[120px] flex-1 rounded-[22px] bg-white/10 px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                  Timeline
                </Text>
                <Text className="mt-2 text-sm font-black text-white">
                  {formatDateLabel(project.start_date)} - {formatDateLabel(project.end_date)}
                </Text>
              </View>
              <View className="min-w-[120px] flex-1 rounded-[22px] bg-white/10 px-4 py-4">
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
                      <View className={`rounded-full px-3 py-2 ${getOrderStatusMeta(order.status).chipClassName}`}>
                        <Text className="text-[10px] font-black uppercase tracking-[2px]">
                          {getOrderStatusMeta(order.status).label}
                        </Text>
                      </View>
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

export function ContractorCategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void fetchCategories({ limit: 12 })
      .then((response) => {
        if (isMounted) {
          setCategories(response);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load material categories.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Bulk-friendly catalog sections for fast sourcing across your active jobs."
        title="Materials"
      />

      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState description={error} title="Catalog unavailable" />
      ) : (
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {categories.map((category) => (
            <Pressable
              className="w-[48%] rounded-[28px] bg-white p-5 active:opacity-85"
              key={category.id}
              onPress={() =>
                router.push({
                  pathname: "/products",
                  params: { category_id: category.id },
                })
              }
            >
              <View className="h-20 w-20 items-center justify-center rounded-[20px] bg-primary-50">
                <MaterialIcons color="#0A2238" name="category" size={30} />
              </View>
              <Text className="mt-4 text-lg font-black text-primary-900">
                {category.name}
              </Text>
              <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
                {category.description}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ContractorPage>
  );
}

export function ContractorProductListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    category_id?: string | string[];
    project_id?: string | string[];
  }>();
  const categoryId = Array.isArray(params.category_id)
    ? params.category_id[0]
    : params.category_id;
  const projectId = Array.isArray(params.project_id)
    ? params.project_id[0]
    : params.project_id;
  const setProject = useContractorOrderStore((state) => state.setProject);
  const selectedProjectId = useContractorOrderStore((state) => state.selectedProjectId);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (projectId) {
      setProject(projectId);
    }
  }, [projectId, setProject]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    void fetchProducts({
      category_id: categoryId,
      limit: 30,
    })
      .then((response) => {
        if (isMounted) {
          setProducts(response);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load materials.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  return (
    <ContractorPage>
      <ContractorSectionHeader
        actionLabel="Bulk Cart"
        onAction={() => router.push("/cart")}
        subtitle={
          selectedProjectId
            ? "Materials you add will stay tied to the selected project."
            : "Select a project before checkout so your order stays site-specific."
        }
        title="Product List"
      />

      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState description={error} title="Materials unavailable" />
      ) : (
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {products.map((product) => (
            <MaterialCard
              key={product.id}
              onPress={() =>
                router.push({
                  pathname: "/product-detail",
                  params: {
                    product_id: product.id,
                    project_id: selectedProjectId ?? projectId,
                  },
                })
              }
              product={product}
            />
          ))}
        </View>
      )}
    </ContractorPage>
  );
}

export function ContractorProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    product_id?: string | string[];
    project_id?: string | string[];
  }>();
  const productId = Array.isArray(params.product_id)
    ? params.product_id[0]
    : params.product_id;
  const projectId = Array.isArray(params.project_id)
    ? params.project_id[0]
    : params.project_id;
  const addItem = useContractorOrderStore((state) => state.addItem);
  const setProject = useContractorOrderStore((state) => state.setProject);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("10");

  useEffect(() => {
    if (projectId) {
      setProject(projectId);
    }
  }, [projectId, setProject]);

  useEffect(() => {
    if (!productId) {
      setError("No product selected.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    void fetchProductById(productId)
      .then((response) => {
        if (isMounted) {
          setProduct(response);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load material details.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const bulkQuantity = Math.max(Number(quantity) || 0, 0);

  return (
    <ContractorPage>
      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error || !product ? (
        <ContractorEmptyState
          actionLabel="Back to materials"
          description={error || "This material could not be loaded."}
          onAction={() => router.push("/products")}
          title="Material unavailable"
        />
      ) : (
        <>
          <View className="overflow-hidden rounded-[32px] bg-white">
            <View className="h-72 bg-neutral-100">
              {product.image_url ? (
                <Image
                  className="h-full w-full"
                  resizeMode="cover"
                  source={{ uri: product.image_url }}
                />
              ) : (
                <View className="h-full items-center justify-center bg-primary-50">
                  <MaterialIcons color="#0A2238" name="inventory-2" size={44} />
                </View>
              )}
            </View>
            <View className="p-5">
              <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-700">
                Bulk material
              </Text>
              <Text className="mt-2 text-3xl font-black text-primary-900">
                {product.name}
              </Text>
              <Text className="mt-3 text-base font-semibold text-accent-700">
                {formatPhilippinePeso(product.price ?? 0)} / {product.unit ?? "unit"}
              </Text>
              <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
                {product.description || "Reliable contractor-grade stock for active site demand."}
              </Text>

              <View className="mt-6 flex-row flex-wrap gap-3">
                <View className="min-w-[120px] flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4">
                  <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                    Stock
                  </Text>
                  <Text className="mt-2 text-sm font-black text-primary-900">
                    {product.stock_quantity ?? 0} available
                  </Text>
                </View>
                <View className="min-w-[120px] flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4">
                  <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                    Unit
                  </Text>
                  <Text className="mt-2 text-sm font-black text-primary-900">
                    {product.unit ?? "unit"}
                  </Text>
                </View>
              </View>

              <View className="mt-6">
                <Text className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
                  Quantity
                </Text>
                <View className="flex-row items-center gap-3">
                  <Pressable
                    className="h-12 w-12 items-center justify-center rounded-[18px] bg-[#F3F5F7]"
                    onPress={() =>
                      setQuantity(String(Math.max((Number(quantity) || 1) - 1, 1)))
                    }
                  >
                    <MaterialIcons color="#0A2238" name="remove" size={20} />
                  </Pressable>
                  <TextInput
                    className="flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-center text-xl font-black text-primary-900"
                    keyboardType="number-pad"
                    onChangeText={setQuantity}
                    value={quantity}
                  />
                  <Pressable
                    className="h-12 w-12 items-center justify-center rounded-[18px] bg-[#F3F5F7]"
                    onPress={() => setQuantity(String((Number(quantity) || 0) + 1))}
                  >
                    <MaterialIcons color="#0A2238" name="add" size={20} />
                  </Pressable>
                </View>
              </View>

              <View className="mt-8 flex-row gap-3">
                <Pressable
                  className="flex-1 items-center rounded-[22px] bg-primary-900 px-4 py-4 active:bg-primary-800"
                  onPress={() => {
                    addItem(product, bulkQuantity || 1);
                    router.push("/cart");
                  }}
                >
                  <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                    Add To Bulk Order
                  </Text>
                </Pressable>
                <Pressable
                  className="items-center rounded-[22px] border border-neutral-300 px-4 py-4 active:bg-neutral-100"
                  onPress={() => router.back()}
                >
                  <Text className="text-xs font-black uppercase tracking-[2px] text-primary-900">
                    Back
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}
    </ContractorPage>
  );
}

export function ContractorCartScreen() {
  const router = useRouter();
  const { accessToken } = useContractorSession();
  const items = useContractorOrderStore((state) => state.items);
  const removeItem = useContractorOrderStore((state) => state.removeItem);
  const selectedProjectId = useContractorOrderStore((state) => state.selectedProjectId);
  const setProject = useContractorOrderStore((state) => state.setProject);
  const setQuantity = useContractorOrderStore((state) => state.setQuantity);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void fetchProjects(accessToken, { limit: 50 }).then(setProjects).catch(() => {
      setProjects([]);
    });
  }, [accessToken]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Review your material list, adjust quantities, and pin the order to the correct project."
        title="Bulk Order Cart"
      />

      {items.length === 0 ? (
        <ContractorEmptyState
          actionLabel="Browse Materials"
          description="Add contractor materials from the catalog to start a bulk order."
          onAction={() => router.push("/categories")}
          title="Your bulk cart is empty"
        />
      ) : (
        <>
          <View className="rounded-[30px] bg-white p-5">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
              Select Project
            </Text>
            <ScrollView
              className="mt-4"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-row gap-3">
                {projects.map((project) => {
                  const isActive = selectedProjectId === project.id;

                  return (
                    <Pressable
                      className={[
                        "rounded-[22px] px-4 py-4",
                        isActive ? "bg-primary-900" : "bg-[#F3F5F7]",
                      ].join(" ")}
                      key={project.id}
                      onPress={() => setProject(project.id)}
                    >
                      <Text
                        className={[
                          "text-sm font-black",
                          isActive ? "text-white" : "text-primary-900",
                        ].join(" ")}
                      >
                        {project.name}
                      </Text>
                      <Text
                        className={[
                          "mt-1 text-xs font-semibold",
                          isActive ? "text-primary-100" : "text-neutral-500",
                        ].join(" ")}
                      >
                        {project.location ?? "Project site"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View className="mt-6 gap-4">
            {items.map((item) => (
              <View className="rounded-[28px] bg-white p-5" key={item.productId}>
                <View className="flex-row gap-4">
                  <View className="h-20 w-20 overflow-hidden rounded-[20px] bg-neutral-100">
                    {item.imageUrl ? (
                      <Image
                        className="h-full w-full"
                        resizeMode="cover"
                        source={{ uri: item.imageUrl }}
                      />
                    ) : (
                      <View className="h-full items-center justify-center bg-primary-50">
                        <MaterialIcons color="#0A2238" name="inventory-2" size={24} />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-black text-primary-900">
                      {item.name}
                    </Text>
                    <Text className="mt-1 text-sm font-medium text-neutral-500">
                      {formatPhilippinePeso(item.price)} / {item.unit}
                    </Text>
                    <View className="mt-4 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <Pressable
                          className="h-10 w-10 items-center justify-center rounded-[16px] bg-[#F3F5F7]"
                          onPress={() =>
                            setQuantity(item.productId, Math.max(item.quantity - 1, 0))
                          }
                        >
                          <MaterialIcons color="#0A2238" name="remove" size={18} />
                        </Pressable>
                        <Text className="min-w-[28px] text-center text-lg font-black text-primary-900">
                          {item.quantity}
                        </Text>
                        <Pressable
                          className="h-10 w-10 items-center justify-center rounded-[16px] bg-[#F3F5F7]"
                          onPress={() => setQuantity(item.productId, item.quantity + 1)}
                        >
                          <MaterialIcons color="#0A2238" name="add" size={18} />
                        </Pressable>
                      </View>
                      <Pressable onPress={() => removeItem(item.productId)}>
                        <Text className="text-xs font-black uppercase tracking-[2px] text-rose-700">
                          Remove
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-6 rounded-[30px] bg-primary-900 p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                Total Cost
              </Text>
              <Text className="text-2xl font-black text-white">
                {formatPhilippinePeso(total)}
              </Text>
            </View>
            <Pressable
              className="mt-5 items-center rounded-[22px] bg-accent-600 px-4 py-4 active:opacity-90"
              onPress={() => router.push("/checkout")}
            >
              <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                Continue To Checkout
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </ContractorPage>
  );
}

export function ContractorCheckoutScreen() {
  const router = useRouter();
  const { accessToken, customer } = useContractorSession();
  const clearOrder = useContractorOrderStore((state) => state.clearOrder);
  const items = useContractorOrderStore((state) => state.items);
  const selectedProjectId = useContractorOrderStore((state) => state.selectedProjectId);
  const [deliveryAddress, setDeliveryAddress] = useState(
    customer?.shipping_address ?? "",
  );
  const [deliverySchedule, setDeliverySchedule] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<ContractorPaymentMethod>("gcash");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handlePlaceOrder = async () => {
    if (!accessToken || !customer?.id) {
      setError("Sign in again before placing this order.");
      return;
    }

    if (!selectedProjectId) {
      setError("Select a project in the bulk cart before checkout.");
      return;
    }

    if (items.length === 0) {
      setError("Add materials to your bulk order before checkout.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const order = await createOrder(accessToken, {
        customer_id: customer.id,
        items: items.map((item) => ({
          line_total: item.price * item.quantity,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        notes: [
          deliveryAddress ? `Delivery address: ${deliveryAddress}` : null,
          deliverySchedule ? `Delivery schedule: ${deliverySchedule}` : null,
          `Payment method: ${paymentMethod.toUpperCase()}`,
          notes.trim() || null,
        ]
          .filter(Boolean)
          .join("\n"),
        project_id: selectedProjectId,
        total_amount: total,
      });

      clearOrder();
      router.replace({
        pathname: "/order-detail",
        params: { order_id: order.id },
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to place your contractor order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Confirm the site delivery details and payment preference before submitting the order."
        title="Checkout"
      />

      <View className="gap-5">
        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Delivery address
          </Text>
          <TextInput
            className="mt-3 min-h-[120px] rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
            multiline
            onChangeText={setDeliveryAddress}
            placeholder="Enter site delivery address"
            placeholderTextColor="#94A3B8"
            textAlignVertical="top"
            value={deliveryAddress}
          />
        </View>

        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Delivery schedule
          </Text>
          <TextInput
            className="mt-3 rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
            onChangeText={setDeliverySchedule}
            placeholder="2026-05-12 08:00 AM"
            placeholderTextColor="#94A3B8"
            value={deliverySchedule}
          />
        </View>

        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Notes for supplier
          </Text>
          <TextInput
            className="mt-3 min-h-[120px] rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
            multiline
            onChangeText={setNotes}
            placeholder="Site gate instructions, unloading notes, contact person..."
            placeholderTextColor="#94A3B8"
            textAlignVertical="top"
            value={notes}
          />
        </View>

        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Payment method
          </Text>
          <View className="mt-4 gap-3">
            {PAYMENT_OPTIONS.map((option) => {
              const isActive = paymentMethod === option.value;

              return (
                <Pressable
                  className={[
                    "rounded-[22px] border px-4 py-4",
                    isActive
                      ? "border-primary-900 bg-primary-900"
                      : "border-neutral-200 bg-[#F3F5F7]",
                  ].join(" ")}
                  key={option.value}
                  onPress={() => setPaymentMethod(option.value)}
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons
                      color={isActive ? "#FFFFFF" : "#0A2238"}
                      name={option.icon}
                      size={22}
                    />
                    <View className="flex-1">
                      <Text
                        className={[
                          "text-sm font-black uppercase tracking-[2px]",
                          isActive ? "text-white" : "text-primary-900",
                        ].join(" ")}
                      >
                        {option.label}
                      </Text>
                      <Text
                        className={[
                          "mt-1 text-sm font-medium leading-5",
                          isActive ? "text-primary-100" : "text-neutral-500",
                        ].join(" ")}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="rounded-[30px] bg-primary-900 p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
            Total cost
          </Text>
          <Text className="mt-2 text-3xl font-black text-white">
            {formatPhilippinePeso(total)}
          </Text>

          {error ? (
            <View className="mt-4 rounded-[18px] bg-white/10 px-4 py-3">
              <Text className="text-sm font-semibold text-white">{error}</Text>
            </View>
          ) : null}

          <Pressable
            className="mt-5 items-center rounded-[22px] bg-accent-600 px-4 py-4 active:opacity-90"
            onPress={() => void handlePlaceOrder()}
          >
            <Text className="text-xs font-black uppercase tracking-[2px] text-white">
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ContractorPage>
  );
}

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
                onPress={() =>
                  setActiveFilter(filter.value as "all" | "active" | "completed")
                }
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
                  <View className={`rounded-full px-3 py-2 ${getOrderStatusMeta(order.status).chipClassName}`}>
                    <Text className="text-[10px] font-black uppercase tracking-[2px]">
                      {getOrderStatusMeta(order.status).label}
                    </Text>
                  </View>
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
  const [project, setProject] = useState<Project | null>(null);

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
          new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
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
            <Text className="mt-3 text-3xl font-black text-white">Order #{order.id}</Text>
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
                <View
                  className="rounded-[22px] bg-[#F3F5F7] px-4 py-4"
                  key={item.id}
                >
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
                <Text className="mt-2 text-sm font-black text-primary-900">
                  {getDeliveryMeta(latestDelivery).label}
                </Text>
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
            orders.slice(0, 10).map((order) =>
              fetchDeliveries(accessToken, { limit: 3, order_id: order.id }),
            ),
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
            <View className="rounded-[28px] bg-white p-5" key={notification.id}>
              <View className="flex-row items-start gap-4">
                <View
                  className={[
                    "h-12 w-12 items-center justify-center rounded-[18px]",
                    notification.tone === "success"
                      ? "bg-emerald-100"
                      : notification.tone === "warning"
                        ? "bg-amber-100"
                        : "bg-primary-50",
                  ].join(" ")}
                >
                  <MaterialIcons
                    color={
                      notification.tone === "success"
                        ? "#15803D"
                        : notification.tone === "warning"
                          ? "#B45309"
                          : "#0A2238"
                    }
                    name="notifications"
                    size={22}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-black text-primary-900">
                    {notification.title}
                  </Text>
                  <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
                    {notification.body}
                  </Text>
                  <Text className="mt-3 text-[11px] font-black uppercase tracking-[2px] text-neutral-400">
                    {notification.dateLabel}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ContractorPage>
  );
}

export function ContractorProfileScreen() {
  const router = useRouter();
  const customer = useAuthStore((state) => state.customer);
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  return (
    <ContractorPage>
      <View className="rounded-[32px] bg-primary-900 px-5 pb-5 pt-6">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-300">
          Contractor profile
        </Text>
        <Text className="mt-3 text-3xl font-black text-white">
          {customer?.contact_name || user?.full_name || "Contractor"}
        </Text>
        <Text className="mt-3 text-sm font-medium leading-6 text-primary-100">
          {customer?.company_name || "Independent contractor account"}
        </Text>
      </View>

      <View className="mt-8 rounded-[30px] bg-white p-5">
        <Text className="text-xl font-black text-primary-900">Account</Text>
        <View className="mt-4 gap-3">
          {[
            {
              label: "User info",
              value: user?.email ?? "No email available",
            },
            {
              label: "Company name",
              value: customer?.company_name ?? "Not provided",
            },
            {
              label: "Saved addresses",
              value: customer?.shipping_address ?? "No delivery address saved",
            },
          ].map((item) => (
            <View className="rounded-[22px] bg-[#F3F5F7] px-4 py-4" key={item.label}>
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                {item.label}
              </Text>
              <Text className="mt-2 text-sm font-black text-primary-900">
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-6 gap-3">
        {[
          { label: "Edit Profile", route: "/edit-profile" },
          { label: "Saved Addresses", route: "/delivery-addresses" },
          { label: "Security Settings", route: "/security-settings" },
          { label: "Notifications", route: "/notifications" },
        ].map((item) => (
          <Pressable
            className="rounded-[24px] bg-white px-5 py-5 active:opacity-85"
            key={item.label}
            onPress={() => router.push(item.route as never)}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-black text-primary-900">{item.label}</Text>
              <MaterialIcons color="#0A2238" name="chevron-right" size={22} />
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable
        className="mt-6 items-center rounded-[24px] bg-rose-600 px-5 py-5 active:opacity-90"
        onPress={() => void signOut()}
      >
        <Text className="text-xs font-black uppercase tracking-[2px] text-white">
          Logout
        </Text>
      </Pressable>
    </ContractorPage>
  );
}

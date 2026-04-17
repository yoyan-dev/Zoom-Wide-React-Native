import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import * as addressesApi from "@/services/addressesApi";
import * as deliveriesApi from "@/services/deliveriesApi";
import * as ordersApi from "@/services/ordersApi";
import { fetchProductById } from "@/services/productsApi";
import { readDefaultDeliveryAddressId } from "@/store/deliveryAddressStorage";
import { useAuthStore } from "@/store/authStore";
import type { Address } from "@/types/address";
import type { Delivery } from "@/types/delivery";
import type { DriverAssignedOrder, OrderItem, OrderStatus } from "@/types/order";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

import { TrackingHero } from "./sections/TrackingHero";
import { TrackingSidePanel } from "./sections/TrackingSidePanel";
import { TrackingTimeline } from "./sections/TrackingTimeline";
import type {
  DeliveryAddress,
  PackageItem,
  TrackingOrderSummary,
  TrackingStep,
} from "./types";

const FALLBACK_MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA3a4VI_cVMHvpFdVvxuw_0NGF8c2JTR3R0rtOSEutQwdFTuX9x_IjWNb-DmUb_KkExvU0zYOgPQDm293beLTArYSDN9nHwf-BI8eRikAEjymMK4HtDHzMwsQn0ggAHoksG3gjmI5L3sZP9cGnwIclGT4g9aTytUhrMv_4-VIOM7cyjdij24eVATPDy_MLMG_hu3PUTLNqMYA1hjAuLOukIyzUCuap327fFWTuAco0jujdnq5-U_aZIFHXMHQBmybna3d-Nwdc6fvc";
const FALLBACK_ITEM_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAH1vdSnuJ7De7o3F3Pl_H4fH7NyWw-xAEBTeF62PgxI3KDzUZ0LfVXd_8nGdYLOhLz947MG5H3RAiycoYuHH__jZ5Qxv5Mu2IpNn1fnNFnG8a6Ot4DjVHqKKVLzwjYz8ajH75--Dwao0PdTLDz-SazhtK0hDVJ2AYzYLhGsmRJ3ZzVD5Dje0efVvuCI1JKFL-r9PhK-PBi5u9pR8sq9cvzixqxJ1qckN2b-lTeAeTC3K-sf3iIqYrmGfFQTKvHTwcQ36UmhQVNZa8";

type TrackingState = {
  deliveryAddress: DeliveryAddress;
  trackingOrder: TrackingOrderSummary;
  trackingSteps: TrackingStep[];
  packageItems: PackageItem[];
};

function formatDateTime(value: string | null | undefined) {
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

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Pending schedule";
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

function createTrackingOrder(order: DriverAssignedOrder, deliveries: Delivery[]) {
  const latestDelivery = deliveries[0] ?? order.delivery ?? order.deliveries?.[0] ?? null;
  const estimatedArrival =
    latestDelivery?.delivered_at ??
    latestDelivery?.scheduled_at ??
    order.updated_at ??
    order.created_at;
  const totalUnits = (order.items ?? []).reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0,
  );

  return {
    orderNumber: `#${order.id}`,
    estimatedArrival: formatDate(estimatedArrival),
    totalWeight: totalUnits > 0 ? `${totalUnits} unit${totalUnits === 1 ? "" : "s"}` : "Not specified",
  };
}

function createTrackingSteps(
  order: DriverAssignedOrder,
  deliveries: Delivery[],
): TrackingStep[] {
  const latestDelivery = deliveries[0] ?? order.delivery ?? order.deliveries?.[0] ?? null;
  const deliveryStatus = latestDelivery?.status ?? null;

  const statuses: TrackingStep["status"][] =
    deliveryStatus === "delivered"
      ? ["complete", "complete", "complete", "complete", "complete"]
      : deliveryStatus === "in_transit"
        ? ["complete", "complete", "complete", "current", "pending"]
        : deliveryStatus === "scheduled"
          ? ["complete", "complete", "current", "pending", "pending"]
          : order.status === "completed"
            ? ["complete", "complete", "complete", "complete", "complete"]
            : order.status === "approved"
              ? ["complete", "complete", "current", "pending", "pending"]
              : ["current", "pending", "pending", "pending", "pending"];

  const statusDescription: Record<OrderStatus, string> = {
    approved: "Inventory has been approved and the order is ready for dispatch scheduling.",
    cancelled: "This order has been cancelled. Contact support if you need assistance.",
    completed: "Order fulfilment is complete and all line items are closed.",
    pending: "Your order has been received and is waiting for approval.",
    rejected: order.rejection_reason || "This order was rejected during review.",
  };

  return [
    {
      title: "Order Placed",
      timestamp: formatDateTime(order.created_at),
      description: order.notes || "Your order has been captured in the system.",
      icon: "check-circle",
      status: statuses[0],
    },
    {
      title: "Order Review",
      timestamp: formatDateTime(order.updated_at),
      description: statusDescription[order.status],
      icon: "verified",
      status: statuses[1],
    },
    {
      title: "Preparing for Shipment",
      timestamp: latestDelivery?.scheduled_at
        ? `Scheduled ${formatDateTime(latestDelivery.scheduled_at)}`
        : "Awaiting delivery schedule",
      description:
        latestDelivery?.vehicle_number
          ? `Vehicle ${latestDelivery.vehicle_number} has been assigned for this delivery.`
          : "Warehouse team is preparing the order for dispatch.",
      icon: "inventory",
      status: statuses[2],
    },
    {
      title: "Out for Delivery",
      timestamp:
        deliveryStatus === "in_transit" || deliveryStatus === "delivered"
          ? formatDateTime(latestDelivery?.updated_at)
          : "Pending dispatch",
      description:
        latestDelivery?.driver_id
          ? "A driver has been assigned and the shipment is in motion."
          : "Driver assignment is still pending.",
      icon: "local-shipping",
      status: statuses[3],
    },
    {
      title: "Delivered",
      timestamp:
        deliveryStatus === "delivered"
          ? formatDateTime(latestDelivery?.delivered_at)
          : "Pending arrival",
      icon: "home",
      status: statuses[4],
    },
  ];
}

function createDeliveryAddress(
  order: DriverAssignedOrder,
  resolvedAddress: Address | null,
  customerName: string,
  customerCompany: string | null | undefined,
  customerShippingAddress: string | null | undefined,
) {
  const addressLines = resolvedAddress
    ? [
        resolvedAddress.address_line,
        resolvedAddress.street,
        [resolvedAddress.city, resolvedAddress.province, resolvedAddress.postal_code]
          .filter(Boolean)
          .join(", "),
        resolvedAddress.country,
      ].filter((line): line is string => Boolean(line && line.trim()))
    : (customerShippingAddress ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

  return {
    name: customerCompany || customerName || `Customer ${order.customer_id}`,
    lines: addressLines.length > 0 ? addressLines : ["Delivery address unavailable"],
    mapImage: FALLBACK_MAP_IMAGE,
  };
}

async function createPackageItems(orderItems: OrderItem[] | null | undefined) {
  const items = orderItems ?? [];

  const enrichedProducts = await Promise.all(
    items.map(async (item) => {
      try {
        const product = await fetchProductById(item.product_id);
        return { item, product };
      } catch {
        return { item, product: null };
      }
    }),
  );

  return enrichedProducts.map(({ item, product }) => ({
    id: item.id,
    image: product?.image_url || FALLBACK_ITEM_IMAGE,
    name:
      product?.name ||
      [item.quantity, product?.unit || "item"]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      `Product ${item.product_id}`,
    price: formatPhilippinePeso(item.line_total || item.unit_price || 0),
    sku: product?.sku || item.product_id,
  }));
}

export function OrderTrackingScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const params = useLocalSearchParams<{ order_id?: string | string[] }>();
  const accessToken = useAuthStore((state) => state.accessToken);
  const customerId = useAuthStore((state) => state.customer?.id ?? null);
  const customerContactName = useAuthStore(
    (state) => state.customer?.contact_name ?? "",
  );
  const customerCompanyName = useAuthStore(
    (state) => state.customer?.company_name ?? null,
  );
  const customerShippingAddress = useAuthStore(
    (state) => state.customer?.shipping_address ?? null,
  );
  const userFullName = useAuthStore((state) => state.user?.full_name ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingState, setTrackingState] = useState<TrackingState | null>(null);

  const orderId = useMemo(() => {
    if (Array.isArray(params.order_id)) {
      return params.order_id[0] ?? null;
    }

    return params.order_id ?? null;
  }, [params.order_id]);

  const loadTracking = useCallback(async () => {
    if (!accessToken || !customerId) {
      setError("Please sign in to view tracking details.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resolvedOrderId =
        orderId ??
        (await ordersApi.fetchOrders(accessToken, {
          customer_id: customerId,
          limit: 1,
        }))[0]?.id;

      if (!resolvedOrderId) {
        throw new Error("No orders available to track yet.");
      }

      const [order, fetchedDeliveries] = await Promise.all([
        ordersApi.fetchOrderById(accessToken, resolvedOrderId),
        deliveriesApi.fetchDeliveries(accessToken, {
          limit: 20,
          order_id: resolvedOrderId,
        }),
      ]);

      const sortedDeliveries = [...(fetchedDeliveries ?? [])].sort((left, right) =>
        new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
      );

      const defaultAddressId = await readDefaultDeliveryAddressId(customerId);
      const addresses = await addressesApi.fetchCustomerAddresses(accessToken, customerId);
      const resolvedAddress =
        addresses.find((address) => address.id === defaultAddressId) ??
        addresses[0] ??
        null;

      const [packageItems] = await Promise.all([createPackageItems(order.items)]);

      setTrackingState({
        deliveryAddress: createDeliveryAddress(
          order,
          resolvedAddress,
          userFullName || customerContactName,
          customerCompanyName,
          customerShippingAddress,
        ),
        packageItems,
        trackingOrder: createTrackingOrder(order, sortedDeliveries),
        trackingSteps: createTrackingSteps(order, sortedDeliveries),
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "We couldn't load the order tracking details.",
      );
      setTrackingState(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    accessToken,
    customerCompanyName,
    customerContactName,
    customerId,
    customerShippingAddress,
    orderId,
    userFullName,
  ]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    void loadTracking();
  }, [isFocused, loadTracking]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-neutral-50 px-6">
        <ActivityIndicator color="#0A2238" size="large" />
        <Text className="text-center text-sm font-semibold text-neutral-600">
          Loading live order tracking data...
        </Text>
      </View>
    );
  }

  if (error || !trackingState) {
    return (
      <View className="flex-1 items-center justify-center gap-6 bg-neutral-50 px-6">
        <View className="w-full max-w-sm rounded-xl border border-red-100 bg-white p-6">
          <Text className="text-lg font-black text-primary-900">
            Tracking unavailable
          </Text>
          <Text className="mt-2 leading-6 text-neutral-600">
            {error || "We couldn't find the tracking details for this order."}
          </Text>
        </View>

        <View className="w-full max-w-sm gap-3">
          <Pressable
            className="items-center rounded-lg bg-primary-900 px-4 py-4 active:bg-primary-800"
            onPress={() => void loadTracking()}
          >
            <Text className="text-xs font-black uppercase tracking-widest text-white">
              Retry Tracking
            </Text>
          </Pressable>
          <Pressable
            className="items-center rounded-lg bg-neutral-200 px-4 py-4 active:bg-neutral-300"
            onPress={() => router.push("/orders")}
          >
            <Text className="text-xs font-black uppercase tracking-widest text-primary-900">
              Back To Orders
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-32 pt-10"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-4xl">
        <TrackingHero trackingOrder={trackingState.trackingOrder} />

        <View className="gap-12">
          <TrackingTimeline trackingSteps={trackingState.trackingSteps} />
          <TrackingSidePanel
            deliveryAddress={trackingState.deliveryAddress}
            packageItems={trackingState.packageItems}
            trackingOrder={trackingState.trackingOrder}
          />
        </View>
      </View>
    </ScrollView>
  );
}

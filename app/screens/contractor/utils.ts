import { PROJECT_STATUS_META } from "@/app/screens/contractor/constants";
import type { ContractorNotification } from "@/app/screens/contractor/types";
import type { Delivery } from "@/types/delivery";
import type { Order, OrderStatus } from "@/types/order";
import type { Project } from "@/types/project";

export function formatDateLabel(value?: string | null) {
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

export function formatDateTimeLabel(value?: string | null) {
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

export function getOrderStatusMeta(status: OrderStatus) {
  switch (status) {
    case "approved":
      return { chipClassName: "bg-sky-100", label: "Approved" };
    case "cancelled":
      return { chipClassName: "bg-neutral-200", label: "Cancelled" };
    case "completed":
      return { chipClassName: "bg-emerald-100", label: "Completed" };
    case "rejected":
      return { chipClassName: "bg-rose-100", label: "Rejected" };
    default:
      return { chipClassName: "bg-amber-100", label: "Pending" };
  }
}

export function getDeliveryMeta(delivery: Delivery | null) {
  switch (delivery?.status) {
    case "delivered":
      return { chipClassName: "bg-emerald-100", label: "Delivered" };
    case "in_transit":
      return { chipClassName: "bg-sky-100", label: "Out for Delivery" };
    case "scheduled":
      return { chipClassName: "bg-amber-100", label: "Preparing" };
    case "cancelled":
      return { chipClassName: "bg-neutral-200", label: "Cancelled" };
    case "failed":
      return { chipClassName: "bg-rose-100", label: "Failed" };
    default:
      return { chipClassName: "bg-neutral-200", label: "Pending" };
  }
}

export function getContractorGreeting(name: string | null | undefined) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return `${greeting}, ${name?.trim() || "Contractor"}`;
}

export function getProjectStatusLabel(status: Project["status"]) {
  return PROJECT_STATUS_META[status]?.label ?? "Active";
}

export function getDeliveryForOrder(deliveries: Delivery[], orderId: string) {
  const filtered = deliveries.filter((delivery) => delivery.order_id === orderId);
  return (
    filtered.sort(
      (left, right) =>
        new Date(right.updated_at).getTime() -
        new Date(left.updated_at).getTime(),
    )[0] ?? null
  );
}

export function buildContractorNotifications(
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
        new Date(left.end_date ?? "").getTime() -
        new Date(right.end_date ?? "").getTime(),
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

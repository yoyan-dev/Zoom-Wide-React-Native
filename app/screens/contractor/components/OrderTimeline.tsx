import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { formatDateTimeLabel } from "@/app/screens/contractor/utils";
import type { Delivery } from "@/types/delivery";
import type { Order } from "@/types/order";

export function OrderTimeline({
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
      complete:
        delivery?.status === "in_transit" || delivery?.status === "delivered",
      description: "Your load is already on the road to the site.",
      title: "Out for Delivery",
      when:
        delivery?.status === "in_transit" || delivery?.status === "delivered"
          ? formatDateTimeLabel(delivery.updated_at)
          : "Driver not dispatched yet",
    },
    {
      complete:
        delivery?.status === "delivered" || order.status === "completed",
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
            <Text className="text-base font-black text-primary-900">
              {step.title}
            </Text>
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

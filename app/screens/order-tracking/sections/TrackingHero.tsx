import { Text, View } from "react-native";

import type { TrackingOrderSummary } from "../types";

type TrackingHeroProps = {
  trackingOrder: TrackingOrderSummary;
};

export function TrackingHero({ trackingOrder }: TrackingHeroProps) {
  return (
    <View className="mb-12">
      <Text className="mb-2 text-xs font-black uppercase tracking-widest text-accent-700">
        Tracking Shipment
      </Text>

      <View className="gap-4">
        <Text className="text-4xl font-black uppercase leading-none tracking-tighter text-primary-900">
          Order {trackingOrder.orderNumber}
        </Text>
        <Text className="font-semibold text-neutral-600">
          Estimated Arrival:{" "}
          <Text className="font-black uppercase text-primary-900">
            {trackingOrder.estimatedArrival}
          </Text>
        </Text>
      </View>
    </View>
  );
}

import { View } from "react-native";

import { orderTrackingStyles } from "../styles";
import type { TrackingStep } from "../types";
import { TimelineStep } from "../ui/TimelineStep";

type TrackingTimelineProps = {
  trackingSteps: TrackingStep[];
};

export function TrackingTimeline({ trackingSteps }: TrackingTimelineProps) {
  return (
    <View
      className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-8"
      style={orderTrackingStyles.cardShadow}
    >
      <View className="relative gap-12">
        <View className="absolute bottom-4 left-[19px] top-4 w-1 rounded-full bg-neutral-200">
          <View className="h-3/4 w-full rounded-full bg-accent-600" />
        </View>

        {trackingSteps.map((step) => (
          <TimelineStep key={step.title} step={step} />
        ))}
      </View>
    </View>
  );
}

import { ScrollView, View } from "react-native";

import { TrackingHero } from "./sections/TrackingHero";
import { TrackingSidePanel } from "./sections/TrackingSidePanel";
import { TrackingTimeline } from "./sections/TrackingTimeline";

export function OrderTrackingScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-32 pt-10"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-4xl">
        <TrackingHero />

        <View className="gap-12">
          <TrackingTimeline />
          <TrackingSidePanel />
        </View>
      </View>
    </ScrollView>
  );
}

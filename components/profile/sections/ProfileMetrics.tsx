import { View } from "react-native";

import { profileMetrics } from "../data";
import { ProfileMetricCard } from "../ui/ProfileMetricCard";

export function ProfileMetrics() {
  return (
    <View className="mb-10 flex-row gap-4">
      {profileMetrics.map((metric) => (
        <ProfileMetricCard key={metric.label} metric={metric} />
      ))}
    </View>
  );
}

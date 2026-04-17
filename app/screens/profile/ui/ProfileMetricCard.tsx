import { Text, View } from "react-native";

import { type ProfileMetric } from "../types";

type ProfileMetricCardProps = {
  metric: ProfileMetric;
};

export function ProfileMetricCard({ metric }: ProfileMetricCardProps) {
  const isPrimary = metric.variant === "primary";

  return (
    <View
      className={[
        "flex-1 rounded-xl p-5",
        isPrimary ? "bg-primary-900" : "border-l-4 border-accent-600 bg-neutral-100",
      ].join(" ")}
    >
      <Text
        className={[
          "mb-2 text-[10px] font-black uppercase tracking-widest",
          isPrimary ? "text-primary-200" : "text-accent-700",
        ].join(" ")}
      >
        {metric.label}
      </Text>
      <Text
        className={[
          "text-3xl font-black",
          isPrimary ? "text-white" : "text-neutral-900",
        ].join(" ")}
      >
        {metric.value}
      </Text>
    </View>
  );
}

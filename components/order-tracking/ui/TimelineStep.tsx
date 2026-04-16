import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { orderTrackingStyles } from "../styles";
import { type TrackingStep } from "../types";

type TimelineStepProps = {
  step: TrackingStep;
};

const markerClassByStatus = {
  complete: "bg-accent-600",
  current: "bg-primary-900",
  pending: "bg-neutral-200",
};

const iconColorByStatus = {
  complete: "#ffffff",
  current: "#ffffff",
  pending: "#667080",
};

export function TimelineStep({ step }: TimelineStepProps) {
  const isCurrent = step.status === "current";
  const isPending = step.status === "pending";

  return (
    <View className={["relative flex-row items-start gap-6", isPending ? "opacity-45" : ""].join(" ")}>
      <View
        className={[
          "z-10 h-10 w-10 shrink-0 items-center justify-center rounded-full",
          markerClassByStatus[step.status],
          isCurrent ? "border-4 border-primary-100" : "",
        ].join(" ")}
        style={isCurrent ? orderTrackingStyles.currentStepShadow : undefined}
      >
        <MaterialIcons
          color={iconColorByStatus[step.status]}
          name={step.icon}
          size={20}
        />
      </View>

      <View className="flex-1 pt-1">
        <Text
          className={[
            "uppercase tracking-tight text-primary-900",
            isCurrent ? "text-xl font-black" : "text-lg font-black",
            isPending ? "text-neutral-600" : "",
          ].join(" ")}
        >
          {step.title}
        </Text>
        <Text
          className={[
            "mt-1 text-sm",
            isCurrent ? "font-black uppercase text-accent-700" : "text-neutral-600",
            isPending ? "italic" : "",
          ].join(" ")}
        >
          {step.timestamp}
        </Text>

        {step.description ? (
          <View
            className={[
              "mt-3",
              isCurrent
                ? "rounded-lg border-l-4 border-accent-600 bg-neutral-100 p-4"
                : "",
            ].join(" ")}
          >
            <Text className="text-sm leading-6 text-neutral-800">
              {step.description}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

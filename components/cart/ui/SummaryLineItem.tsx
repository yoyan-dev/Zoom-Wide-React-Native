import { Text, View } from "react-native";

import { type SummaryLine } from "../types";

type SummaryLineItemProps = {
  line: SummaryLine;
};

export function SummaryLineItem({ line }: SummaryLineItemProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs font-black uppercase tracking-wider text-neutral-600">
        {line.label}
      </Text>
      <Text
        className={[
          "font-black",
          line.accent ? "text-accent-700" : "text-neutral-600",
        ].join(" ")}
      >
        {line.value}
      </Text>
    </View>
  );
}

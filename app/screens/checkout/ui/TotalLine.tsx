import { Text, View } from "react-native";

import { type CheckoutTotalLine } from "../types";

type TotalLineProps = {
  line: CheckoutTotalLine;
};

export function TotalLine({ line }: TotalLineProps) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm font-black uppercase tracking-widest text-neutral-500">
        {line.label}
      </Text>
      <Text className="font-black text-primary-900">{line.value}</Text>
    </View>
  );
}

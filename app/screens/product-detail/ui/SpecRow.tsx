import { Text, View } from "react-native";

import { type ProductSpec } from "../types";

type SpecRowProps = {
  spec: ProductSpec;
};

export function SpecRow({ spec }: SpecRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="text-sm font-black uppercase text-neutral-500">
        {spec.label}
      </Text>
      <Text className="text-right text-sm font-black text-primary-900">
        {spec.value}
      </Text>
    </View>
  );
}

import { Image, Text, View } from "react-native";

import { type CheckoutItem } from "../types";

type SummaryProductRowProps = {
  item: CheckoutItem;
};

export function SummaryProductRow({ item }: SummaryProductRowProps) {
  return (
    <View className="flex-row gap-4">
      <View className="h-20 w-20 overflow-hidden rounded-lg bg-neutral-100">
        <Image
          className="h-full w-full"
          resizeMode="cover"
          source={{ uri: item.image }}
        />
      </View>

      <View className="flex-1">
        <Text className="text-sm font-black uppercase tracking-tight text-primary-900">
          {item.name}
        </Text>
        <Text className="mb-2 text-xs font-medium text-neutral-500">
          {item.spec}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-black uppercase tracking-widest text-neutral-400">
            Qty: {item.quantity}
          </Text>
          <Text className="font-black text-primary-900">{item.price}</Text>
        </View>
      </View>
    </View>
  );
}

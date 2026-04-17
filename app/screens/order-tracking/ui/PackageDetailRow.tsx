import { Image, Text, View } from "react-native";

import { type PackageItem } from "../types";

type PackageDetailRowProps = {
  item: PackageItem;
};

export function PackageDetailRow({ item }: PackageDetailRowProps) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-12 w-12 overflow-hidden rounded bg-neutral-100">
        <Image
          className="h-full w-full opacity-80"
          resizeMode="cover"
          source={{ uri: item.image }}
        />
      </View>

      <View className="flex-1">
        <Text className="text-sm font-black text-primary-900">{item.name}</Text>
        <Text className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
          SKU: {item.sku}
        </Text>
      </View>

      <Text className="font-black text-primary-900">{item.price}</Text>
    </View>
  );
}

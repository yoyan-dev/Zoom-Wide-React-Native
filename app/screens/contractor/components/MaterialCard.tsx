import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Pressable, Text, View } from "react-native";

import type { Product } from "@/types/product";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function MaterialCard({
  onPress,
  product,
}: {
  onPress: () => void;
  product: Product;
}) {
  return (
    <Pressable
      className="w-[48%] rounded-[26px] bg-white p-3 active:opacity-85"
      onPress={onPress}
      style={{
        elevation: 4,
        shadowColor: "#091C2A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      }}
    >
      <View className="h-32 overflow-hidden rounded-[18px] bg-neutral-100">
        {product.image_url ? (
          <Image
            className="h-full w-full"
            resizeMode="cover"
            source={{ uri: product.image_url }}
          />
        ) : (
          <View className="h-full items-center justify-center bg-primary-50">
            <MaterialIcons color="#0A2238" name="inventory-2" size={34} />
          </View>
        )}
      </View>
      <Text className="mt-3 text-sm font-black leading-5 text-primary-900">
        {product.name ?? "Material"}
      </Text>
      <Text className="mt-1 text-xs font-semibold uppercase tracking-[2px] text-neutral-500">
        {product.unit ?? "unit"} • Stock {product.stock_quantity ?? 0}
      </Text>
      <View className="mt-3 flex-row items-center justify-between gap-3">
        <Text className="text-base font-black text-accent-700">
          {formatPhilippinePeso(product.price ?? 0)}
        </Text>
        <View className="rounded-full bg-primary-900 px-3 py-2">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-white">
            Bulk
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

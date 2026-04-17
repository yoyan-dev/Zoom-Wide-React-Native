import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Pressable, Text, View } from "react-native";

import { type CartLineItem } from "@/types/cart";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

import { cartStyles } from "../styles";
import { QuantityControl } from "./QuantityControl";

type CartItemCardProps = {
  isUpdating?: boolean;
  item: CartLineItem;
  onDecrease?: () => void;
  onIncrease?: () => void;
  onRemove?: () => void;
};

export function CartItemCard({
  isUpdating,
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemCardProps) {
  const unitPrice = item.price ?? item.unit_price ?? null;
  const lineTotal =
    typeof unitPrice === "number" ? unitPrice * item.quantity : null;

  return (
    <View
      className="overflow-hidden rounded-xl bg-white p-4"
      style={cartStyles.cardShadow}
    >
      <View className="flex flex-row items-center  gap-4">
        <View className="h-36 overflow-hidden rounded-lg bg-neutral-100">
          {item.image_url ? (
            <Image
              className="h-24 w-32"
              resizeMode="cover"
              source={{ uri: item.image_url }}
            />
          ) : null}
        </View>

        <View className="gap-2 flex-1">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-accent-700">
                {item.unit ?? "unit"}
              </Text>
              <Text className="text-xl font-black leading-tight text-primary-900">
                {item.name ?? item.sku ?? item.product_id}
              </Text>
            </View>

            <Pressable
              className="p-2 active:opacity-60"
              disabled={isUpdating}
              onPress={onRemove}
            >
              <MaterialIcons name="delete" size={22} color="#737781" />
            </Pressable>
          </View>

          <Text className="text-sm font-medium leading-5 text-neutral-600">
            SKU: {item.sku ?? item.product_id}
          </Text>

          <View className="flex-row items-end justify-between pt-4">
            <QuantityControl
              disabled={isUpdating}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              quantity={item.quantity}
            />

            <View className="items-end">
              <Text className="text-2xl font-black text-primary-900">
                {formatPhilippinePeso(lineTotal)}
              </Text>
              <Text className="text-[10px] font-black uppercase text-neutral-400">
                {formatPhilippinePeso(unitPrice)} / {item.unit ?? "unit"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

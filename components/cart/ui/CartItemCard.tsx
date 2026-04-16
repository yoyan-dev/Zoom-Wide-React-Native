import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Pressable, Text, View } from "react-native";

import { cartStyles } from "../styles";
import { type CartItem } from "../types";
import { QuantityControl } from "./QuantityControl";

type CartItemCardProps = {
  item: CartItem;
};

export function CartItemCard({ item }: CartItemCardProps) {
  return (
    <View
      className="overflow-hidden rounded-xl bg-white p-4"
      style={cartStyles.cardShadow}
    >
      <View className="gap-5">
        <View className="h-36 overflow-hidden rounded-lg bg-neutral-100">
          <Image
            className="h-full w-full"
            resizeMode="cover"
            source={{ uri: item.image }}
          />
        </View>

        <View className="gap-2">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-accent-700">
                {item.category}
              </Text>
              <Text className="text-xl font-black leading-tight text-primary-900">
                {item.name}
              </Text>
            </View>

            <Pressable className="p-2 active:opacity-60">
              <MaterialIcons name="delete" size={22} color="#737781" />
            </Pressable>
          </View>

          <Text className="text-sm font-medium leading-5 text-neutral-600">
            {item.description}
          </Text>

          <View className="flex-row items-end justify-between pt-4">
            <QuantityControl quantity={item.quantity} />

            <View className="items-end">
              <Text className="text-2xl font-black text-primary-900">
                {item.price}
              </Text>
              {item.unitPrice ? (
                <Text className="text-[10px] font-black uppercase text-neutral-400">
                  {item.unitPrice}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

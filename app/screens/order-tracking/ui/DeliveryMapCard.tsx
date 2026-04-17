import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Text, View } from "react-native";

import { type DeliveryAddress } from "../types";

type DeliveryMapCardProps = {
  address: DeliveryAddress;
};

export function DeliveryMapCard({ address }: DeliveryMapCardProps) {
  return (
    <View className="overflow-hidden rounded-xl bg-neutral-100">
      <View className="relative h-48 overflow-hidden bg-neutral-200">
        <Image
          className="h-full w-full"
          resizeMode="cover"
          source={{ uri: address.mapImage }}
        />
        <View className="absolute inset-0 items-center justify-center bg-primary-900/20">
          <View className="rounded-full bg-white p-2">
            <MaterialIcons name="location-on" size={32} color="#D87412" />
          </View>
        </View>
      </View>

      <View className="p-6">
        <Text className="mb-3 text-xs font-black uppercase tracking-widest text-neutral-600">
          Delivery Address
        </Text>
        <Text className="font-black text-primary-900">{address.name}</Text>
        <Text className="mt-1 leading-6 text-neutral-600">
          {address.lines.join("\n")}
        </Text>
      </View>
    </View>
  );
}

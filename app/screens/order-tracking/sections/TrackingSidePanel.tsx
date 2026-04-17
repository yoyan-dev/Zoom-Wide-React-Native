import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { deliveryAddress, packageItems, trackingOrder } from "../data";
import { DeliveryMapCard } from "../ui/DeliveryMapCard";
import { PackageDetailRow } from "../ui/PackageDetailRow";

export function TrackingSidePanel() {
  const router = useRouter();

  return (
    <View className="gap-6">
      <DeliveryMapCard address={deliveryAddress} />

      <View className="rounded-xl border border-neutral-200 bg-white p-6">
        <Text className="mb-4 text-xs font-black uppercase tracking-widest text-neutral-600">
          Package Details
        </Text>

        <View className="gap-4">
          {packageItems.map((item) => (
            <PackageDetailRow item={item} key={item.id} />
          ))}
        </View>

        <View className="mt-6 border-t border-neutral-200 pt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-black uppercase tracking-widest text-neutral-600">
              Total Weight
            </Text>
            <Text className="font-black italic text-primary-900">
              {trackingOrder.totalWeight}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        className="flex-row items-center justify-center gap-3 rounded-lg bg-neutral-200 py-4 active:bg-neutral-300"
        onPress={() => router.push("/profile")}
      >
        <MaterialIcons name="contact-support" size={24} color="#0A2238" />
        <Text className="text-xs font-black uppercase tracking-widest text-primary-900">
          Contact Dispatch Support
        </Text>
      </Pressable>
    </View>
  );
}

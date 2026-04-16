import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

export function TradeGuarantee() {
  return (
    <View className="flex-row items-center gap-4 rounded-lg bg-neutral-100 p-4">
      <View className="rounded-full bg-accent-100 p-3">
        <MaterialIcons name="verified-user" size={24} color="#D87412" />
      </View>

      <View className="flex-1">
        <Text className="text-[10px] font-black uppercase tracking-widest text-accent-700">
          Trade Guarantee
        </Text>
        <Text className="mt-0.5 text-xs font-medium leading-5 text-neutral-600">
          Industrial-grade insurance included on all freight orders.
        </Text>
      </View>
    </View>
  );
}

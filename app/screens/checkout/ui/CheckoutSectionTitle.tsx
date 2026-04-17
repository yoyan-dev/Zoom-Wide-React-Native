import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { type MaterialIconName } from "../types";

type CheckoutSectionTitleProps = {
  icon: MaterialIconName;
  title: string;
};

export function CheckoutSectionTitle({ icon, title }: CheckoutSectionTitleProps) {
  return (
    <View className="mb-6 flex-row items-center gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
        <MaterialIcons name={icon} size={24} color="#0A2238" />
      </View>
      <Text className="flex-1 text-2xl font-black uppercase tracking-tight text-primary-900">
        {title}
      </Text>
    </View>
  );
}

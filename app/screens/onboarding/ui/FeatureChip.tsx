import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { type MaterialIconName } from "../types";

type FeatureChipProps = {
  icon: MaterialIconName;
  label: string;
};

export function FeatureChip({ icon, label }: FeatureChipProps) {
  return (
    <View className="flex-1 flex-row items-center gap-3 rounded-lg bg-neutral-100 p-4">
      <MaterialIcons name={icon} size={24} color="#0A2238" />
      <Text className="flex-1 text-xs font-black uppercase tracking-widest text-primary-900">
        {label}
      </Text>
    </View>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

type TierBadgeProps = {
  label: string;
};

export function TierBadge({ label }: TierBadgeProps) {
  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full bg-primary-50 px-3 py-1">
      <MaterialIcons name="verified" size={14} color="#0A2238" />
      <Text className="text-[11px] font-black uppercase tracking-tight text-primary-900">
        {label}
      </Text>
    </View>
  );
}

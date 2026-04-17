import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

type FilterChipProps = {
  label: string;
};

export function FilterChip({ label }: FilterChipProps) {
  return (
    <View className="flex-row items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2.5">
      <Text className="text-sm font-bold text-neutral-600">{label}</Text>
      <MaterialIcons name="close" size={14} color="#667080" />
    </View>
  );
}

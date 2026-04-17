import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

type SortSelectProps = {
  label: string;
};

export function SortSelect({ label }: SortSelectProps) {
  return (
    <View className="flex-row items-center gap-4">
      <Text className="text-sm font-black uppercase text-neutral-600">
        Sort By:
      </Text>
      <View className="min-w-48 flex-1 flex-row items-center justify-between rounded-lg bg-white px-4 py-3">
        <Text className="text-sm font-black text-neutral-900">
          {label}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#424750" />
      </View>
    </View>
  );
}

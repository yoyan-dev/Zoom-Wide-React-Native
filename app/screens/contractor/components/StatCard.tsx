import { Text, View } from "react-native";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-[16px] bg-white p-4 shadow-md">
      <Text className="text-xs text-neutral-400">{label}</Text>
      <Text className="mt-1 text-xl font-black text-primary-900">{value}</Text>
    </View>
  );
}

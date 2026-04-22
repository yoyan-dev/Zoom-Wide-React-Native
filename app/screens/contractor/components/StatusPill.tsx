import { Text, View } from "react-native";

export function StatusPill({
  chipClassName,
  label,
  textClassName,
}: {
  chipClassName: string;
  label: string;
  textClassName?: string;
}) {
  return (
    <View className={`rounded-full px-3 py-2 ${chipClassName}`}>
      <Text
        className={`text-[10px] font-black uppercase tracking-[2px] ${textClassName ?? "text-primary-900"}`}
      >
        {label}
      </Text>
    </View>
  );
}

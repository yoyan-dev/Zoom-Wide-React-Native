import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text } from "react-native";

export function ActionCard({
  icon,
  label,
  color,
  className,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
  className: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`min-w-[140px] flex-1 rounded-[5px]  px-4 py-5 active:bg-neutral-200 ${className}`}
      onPress={onPress}
    >
      <MaterialIcons color={color} name={icon} size={22} />
      <Text className={`mt-3 text-sm uppercase tracking-[2px] ${className}`}>
        {label}
      </Text>
    </Pressable>
  );
}

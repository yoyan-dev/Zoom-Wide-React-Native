import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text } from "react-native";

import { onboardingStyles } from "../styles";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      className="min-h-14 flex-row items-center justify-center gap-3 rounded-lg bg-primary-900 px-8 py-4 active:bg-primary-800"
      onPress={onPress}
      style={onboardingStyles.primaryButton}
    >
      <Text className="text-sm font-black uppercase tracking-widest text-white">
        {label}
      </Text>
      <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
    </Pressable>
  );
}

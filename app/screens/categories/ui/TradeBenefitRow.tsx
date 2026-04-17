import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { type TradeBenefit } from "../types";

type TradeBenefitRowProps = {
  benefit: TradeBenefit;
};

export function TradeBenefitRow({ benefit }: TradeBenefitRowProps) {
  return (
    <View className="flex-row items-center gap-4">
      <MaterialIcons name={benefit.icon} size={22} color="#FC7719" />
      <Text className="flex-1 text-sm font-semibold text-white/70">
        {benefit.label}
      </Text>
    </View>
  );
}

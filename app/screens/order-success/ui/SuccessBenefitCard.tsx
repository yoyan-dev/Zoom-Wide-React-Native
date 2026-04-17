import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { type SuccessBenefit } from "../types";

type SuccessBenefitCardProps = {
  benefit: SuccessBenefit;
};

export function SuccessBenefitCard({ benefit }: SuccessBenefitCardProps) {
  return (
    <View className="flex-1 flex-row items-start gap-4 rounded-lg bg-neutral-100 p-6">
      <MaterialIcons name={benefit.icon} size={24} color="#D87412" />
      <View className="flex-1">
        <Text className="text-sm font-black uppercase text-neutral-900">
          {benefit.title}
        </Text>
        <Text className="mt-1 text-xs font-medium leading-5 text-neutral-600">
          {benefit.description}
        </Text>
      </View>
    </View>
  );
}

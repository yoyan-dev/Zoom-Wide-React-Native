import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { type MaterialIconName } from "../types";

type SpecCardProps = {
  icon: MaterialIconName;
  iconColor: string;
  title: string;
  body: string;
};

export function SpecCard({ icon, iconColor, title, body }: SpecCardProps) {
  return (
    <View className="flex-1 rounded-xl border border-neutral-200 bg-neutral-100 p-5">
      <MaterialIcons name={icon} size={30} color={iconColor} />
      <Text className="mt-3 text-sm font-black tracking-tight text-primary-900">
        {title}
      </Text>
      <Text className="mt-1 text-[11px] font-medium leading-5 text-neutral-600">
        {body}
      </Text>
    </View>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { type MaterialIconName } from "../types";

type CategoryPillProps = {
  icon: MaterialIconName;
  label: string;
};

export function CategoryPill({ icon, label }: CategoryPillProps) {
  const router = useRouter();

  return (
    <Pressable
      className="w-20 items-center gap-2 active:opacity-70"
      onPress={() => router.push("/products")}
    >
      <View className="h-16 w-16 items-center justify-center rounded-xl bg-neutral-100">
        <MaterialIcons name={icon} size={26} color="#0A2238" />
      </View>
      <Text className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-900">
        {label}
      </Text>
    </Pressable>
  );
}

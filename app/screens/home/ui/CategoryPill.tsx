import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Category } from "@/types/category";

import { type MaterialIconName } from "../types";

type CategoryPillProps = {
  category: Category;
};

function getCategoryIcon(name: string): MaterialIconName {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("cement")) {
    return "architecture";
  }

  if (normalizedName.includes("steel") || normalizedName.includes("bar")) {
    return "foundation";
  }

  if (normalizedName.includes("electric")) {
    return "electrical-services";
  }

  if (normalizedName.includes("pipe") || normalizedName.includes("plumb")) {
    return "plumbing";
  }

  if (normalizedName.includes("paint")) {
    return "format-paint";
  }

  if (normalizedName.includes("tool") || normalizedName.includes("hardware")) {
    return "construction";
  }

  return "category";
}

export function CategoryPill({ category }: CategoryPillProps) {
  const router = useRouter();
  const icon = getCategoryIcon(category.name);

  return (
    <Pressable
      className="w-20 items-center gap-2 active:opacity-70"
      onPress={() =>
        router.push({
          pathname: "/products",
          params: { category_id: category.id },
        })
      }
    >
      <View className="h-16 w-16 items-center justify-center rounded-xl bg-neutral-100">
        <MaterialIcons name={icon} size={26} color="#0A2238" />
      </View>
      <Text className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-900">
        {category.name}
      </Text>
    </Pressable>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { activeFilters } from "../data";
import { FilterChip } from "../ui/FilterChip";
import { SortSelect } from "../ui/SortSelect";

export function FilterSortBar() {
  const router = useRouter();

  return (
    <View className="mb-12 gap-6 border-y border-neutral-200 py-6">
      <View className="flex-row flex-wrap gap-3">
        <Pressable
          className="flex-row items-center gap-2 rounded-lg bg-primary-900 px-5 py-2.5 active:bg-primary-800"
          onPress={() => router.push("/categories")}
        >
          <MaterialIcons name="tune" size={16} color="#ffffff" />
          <Text className="text-sm font-black uppercase text-white">Filters</Text>
        </Pressable>

        {activeFilters.map((filter) => (
          <FilterChip key={filter} label={filter} />
        ))}
      </View>

      <SortSelect />
    </View>
  );
}

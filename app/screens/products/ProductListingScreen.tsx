import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { FilterSortBar } from "./sections/FilterSortBar";
import { ProductGrid } from "./sections/ProductGrid";
import { ProductListingHeader } from "./sections/ProductListingHeader";

export function ProductListingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-7xl">
          <ProductListingHeader />
          <FilterSortBar />
          <ProductGrid />
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary-900 shadow-2xl active:scale-90"
        onPress={() => router.push("/profile")}
      >
        <MaterialIcons name="engineering" size={26} color="#ffffff" />
      </Pressable>
    </View>
  );
}

import { ScrollView, View } from "react-native";

import { CatalogGrid } from "./sections/CatalogGrid";
import { CatalogIntro } from "./sections/CatalogIntro";
import { TradeOrderCallout } from "./sections/TradeOrderCallout";

export function CategoriesScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-32 pt-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-7xl">
        <CatalogIntro />
        <CatalogGrid />
        <TradeOrderCallout />
      </View>
    </ScrollView>
  );
}

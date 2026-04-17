import { ScrollView, View } from "react-native";

import { CategoryList } from "./sections/CategoryList";
import { FeaturedMaterialsSection } from "./sections/FeaturedMaterialsSection";
import { PromoBanner } from "./sections/PromoBanner";
import { SearchTrackSection } from "./sections/SearchTrackSection";
import { TradeSupportSection } from "./sections/TradeSupportSection";

export function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-28 pt-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-screen-xl">
        <SearchTrackSection />
        <CategoryList />
        <PromoBanner />
        <FeaturedMaterialsSection />
        <TradeSupportSection />
      </View>
    </ScrollView>
  );
}

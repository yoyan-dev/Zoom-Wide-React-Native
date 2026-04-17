import { ScrollView, View } from "react-native";

import { DetailTabs } from "./sections/DetailTabs";
import { ProductHero } from "./sections/ProductHero";
import { RelatedProducts } from "./sections/RelatedProducts";

export function ProductDetailScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-4 pb-32 pt-8 md:px-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-7xl">
        <ProductHero />
        <DetailTabs />
        <RelatedProducts />
      </View>
    </ScrollView>
  );
}

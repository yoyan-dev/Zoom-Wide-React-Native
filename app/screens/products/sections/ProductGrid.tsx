import { View } from "react-native";

import { steelBarProducts } from "../data";
import { ProductListingCard } from "../ui/ProductListingCard";

export function ProductGrid() {
  return (
    <View className="flex-row flex-wrap gap-x-8 gap-y-12">
      {steelBarProducts.map((product) => (
        <View className="min-w-[220px] flex-1" key={product.id}>
          <ProductListingCard product={product} />
        </View>
      ))}
    </View>
  );
}

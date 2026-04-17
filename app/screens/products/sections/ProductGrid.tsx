import { View } from "react-native";

import { type ProductListingItem } from "../types";
import { ProductListingCard } from "../ui/ProductListingCard";

type ProductGridProps = {
  products: ProductListingItem[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <View className="flex-row flex-wrap gap-x-8 gap-y-12">
      {products.map((product) => (
        <View className="min-w-[220px] flex-1" key={product.id}>
          <ProductListingCard product={product} />
        </View>
      ))}
    </View>
  );
}

import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Product } from "@/types/product";

import { ProductCard } from "../ui/ProductCard";

type FeaturedMaterialsSectionProps = {
  products: Product[];
};

export function FeaturedMaterialsSection({
  products,
}: FeaturedMaterialsSectionProps) {
  const router = useRouter();
  const [featuredProduct, ...standardProducts] = products;

  if (products.length === 0) {
    return (
      <View className="mb-12 rounded-lg bg-white p-6">
        <Text className="text-base font-black text-primary-900">
          No featured materials yet
        </Text>
        <Text className="mt-2 text-sm font-semibold text-neutral-500">
          Products will appear here once the catalog is published.
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-12">
      <View className="mb-8 flex-row items-end justify-between gap-4">
        <View className="flex-1">
          <Text className="mb-1 text-xs font-black uppercase tracking-widest text-accent-700">
            Essential Gear
          </Text>
          <Text className="text-4xl font-black uppercase tracking-tighter text-primary-900">
            Featured Materials
          </Text>
        </View>
        <Pressable
          className="active:opacity-60"
          onPress={() => router.push("/products")}
        >
          <Text className="text-sm font-black underline text-primary-900">
            View All
          </Text>
        </Pressable>
      </View>

      <View className="gap-6">
        {featuredProduct ? (
          <ProductCard featured product={featuredProduct} />
        ) : null}

        <View className="flex-row flex-wrap gap-6">
          {standardProducts.map((product) => (
            <View className="min-w-[150px] flex-1" key={product.id}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

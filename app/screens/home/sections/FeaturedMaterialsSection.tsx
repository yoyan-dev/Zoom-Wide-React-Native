import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { featuredMaterials } from "../data";
import { ProductCard } from "../ui/ProductCard";

export function FeaturedMaterialsSection() {
  const router = useRouter();
  const [featuredProduct, ...standardProducts] = featuredMaterials;

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
        {featuredProduct ? <ProductCard product={featuredProduct} /> : null}

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

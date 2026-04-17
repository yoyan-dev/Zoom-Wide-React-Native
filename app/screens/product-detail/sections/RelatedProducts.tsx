import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Product } from "@/types/product";

import { RelatedProductCard } from "../ui/RelatedProductCard";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  const router = useRouter();

  if (products.length === 0) {
    return null;
  }

  return (
    <View className="mt-24">
      <View className="mb-10 flex-row items-end justify-between gap-4">
        <Text className="flex-1 text-3xl font-black uppercase tracking-tighter text-primary-900">
          Related Essentials
        </Text>
        <Pressable
          className="flex-row items-center gap-1 active:opacity-70"
          onPress={() => router.push("/products")}
        >
          <Text className="text-sm font-black uppercase tracking-widest text-accent-700">
            View All Materials
          </Text>
          <MaterialIcons name="arrow-right-alt" size={20} color="#D87412" />
        </Pressable>
      </View>

      <View className="flex-row flex-wrap gap-6">
        {products.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </View>
    </View>
  );
}

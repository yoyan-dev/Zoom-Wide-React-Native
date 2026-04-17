import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import type { Product } from "@/types/product";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

type RelatedProductCardProps = {
  product: Product;
};

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const router = useRouter();
  const openProduct = () => {
    if (product.id) {
      router.push({
        pathname: "/product-detail",
        params: { product_id: product.id },
      });
    }
  };

  return (
    <Pressable
      className="min-w-[180px] flex-1"
      onPress={openProduct}
    >
      <View className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
        {product.image_url ? (
          <Image
            className="h-full w-full"
            resizeMode="cover"
            source={{ uri: product.image_url }}
          />
        ) : null}
      </View>
      <Text className="text-lg font-black tracking-tight text-primary-900">
        {product.name ?? product.sku ?? "Product"}
      </Text>
      <View className="mt-2 flex-row items-center justify-between gap-3">
        <Text className="font-black text-accent-700">
          {formatPhilippinePeso(product.price)}
        </Text>
        <Text className="text-xs font-black uppercase text-neutral-500">
          {product.is_active === false ? "Unavailable" : "In Stock"}
        </Text>
      </View>
    </Pressable>
  );
}

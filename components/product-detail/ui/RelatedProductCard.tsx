import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { type RelatedProduct } from "../types";

type RelatedProductCardProps = {
  product: RelatedProduct;
};

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const router = useRouter();

  return (
    <Pressable
      className="min-w-[180px] flex-1"
      onPress={() => router.push("/product-detail")}
    >
      <View className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
        <Image
          className="h-full w-full"
          resizeMode="cover"
          source={{ uri: product.image }}
        />
      </View>
      <Text className="text-lg font-black tracking-tight text-primary-900">
        {product.name}
      </Text>
      <View className="mt-2 flex-row items-center justify-between gap-3">
        <Text className="font-black text-accent-700">{product.price}</Text>
        <Text className="text-xs font-black uppercase text-neutral-500">
          {product.status}
        </Text>
      </View>
    </Pressable>
  );
}

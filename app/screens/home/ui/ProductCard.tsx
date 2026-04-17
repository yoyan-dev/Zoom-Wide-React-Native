import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { homeStyles } from "../styles";
import { type Product } from "../types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  if (product.featured) {
    return <FeaturedProductCard product={product} />;
  }

  return (
    <Pressable
      className="w-full rounded-xl bg-white p-5"
      onPress={() => router.push("/product-detail")}
      style={homeStyles.cardShadow}
    >
      <View className="mb-4 h-40 overflow-hidden rounded-lg bg-neutral-100">
        <Image
          className="h-full w-full opacity-90"
          resizeMode="cover"
          source={{ uri: product.image }}
        />
      </View>

      <Text className="mb-1 text-sm font-black uppercase tracking-tight text-primary-900">
        {product.title}
      </Text>
      <Text className="mb-4 text-xs font-semibold text-neutral-500">
        {product.description}
      </Text>

      <View className="mt-auto flex-row items-center justify-between">
        <Text className="text-lg font-black text-primary-900">
          {product.price}
        </Text>
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 active:opacity-70"
          onPress={(event) => {
            event.stopPropagation();
            router.push("/cart");
          }}
        >
          <MaterialIcons name="add" size={22} color="#0A2238" />
        </Pressable>
      </View>
    </Pressable>
  );
}

function FeaturedProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  return (
    <Pressable
      className="w-full rounded-xl bg-white p-6"
      onPress={() => router.push("/product-detail")}
      style={homeStyles.cardShadow}
    >
      <View className="mb-6 h-64 overflow-hidden rounded-lg bg-neutral-100">
        <Image
          className="h-full w-full opacity-90"
          resizeMode="cover"
          source={{ uri: product.image }}
        />
      </View>

      <View className="gap-4">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="mb-1 text-2xl font-black uppercase tracking-tight text-primary-900">
              {product.title}
            </Text>
            <Text className="font-semibold text-neutral-500">
              {product.description}
            </Text>
          </View>

          <Text className="text-right text-2xl font-black text-primary-900">
            {product.price}{" "}
            {product.unit ? (
              <Text className="text-xs font-normal text-neutral-400">
                {product.unit}
              </Text>
            ) : null}
          </Text>
        </View>

        <Pressable
          className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-primary-900 px-5 py-4 active:bg-primary-800"
          onPress={(event) => {
            event.stopPropagation();
            router.push("/cart");
          }}
        >
          <MaterialIcons name="add-shopping-cart" size={22} color="#ffffff" />
          <Text className="text-sm font-black uppercase tracking-widest text-white">
            Add To Order
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

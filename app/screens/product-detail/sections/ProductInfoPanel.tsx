import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { type productDetail as productDetailType } from "../data";
import { type ProductSpec } from "../types";
import { QuantitySelector } from "../ui/QuantitySelector";
import { RatingStars } from "../ui/RatingStars";
import { SpecRow } from "../ui/SpecRow";

type ProductInfoPanelProps = {
  product: typeof productDetailType;
  specs: ProductSpec[];
};

export function ProductInfoPanel({ product, specs }: ProductInfoPanelProps) {
  const router = useRouter();

  return (
    <View>
      <View className="mb-4">
        <Text className="mb-4 text-4xl font-black uppercase leading-none tracking-tighter text-primary-900">
          {product.title}
        </Text>
        <Text className="text-lg font-medium leading-8 text-neutral-600">
          {product.description}
        </Text>
      </View>

      <RatingStars />

      <View className="mb-8 rounded-xl bg-neutral-100 p-6">
        <View className="flex-row flex-wrap items-baseline gap-2">
          <Text className="text-4xl font-black text-primary-900">
            {product.price}
          </Text>
          <Text className="text-sm font-black uppercase text-neutral-500">
            {product.unit}
          </Text>
        </View>
        <View className="mt-2 flex-row items-center gap-2">
          <MaterialIcons name="local-shipping" size={16} color="#D87412" />
          <Text className="text-xs font-black uppercase tracking-widest text-accent-700">
            {product.deliveryNote}
          </Text>
        </View>
      </View>

      <View className="gap-6">
        <View className="gap-3">
          <View className="flex-row flex-wrap items-center justify-between gap-3">
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full bg-green-500" />
              <Text className="text-sm font-black uppercase tracking-tight text-green-700">
                {product.stock}
              </Text>
            </View>
            <Text className="text-sm font-medium text-neutral-600">
              Ships from:{" "}
              <Text className="font-black text-primary-900">
                {product.warehouse}
              </Text>
            </Text>
          </View>

          <View className="gap-4">
            <QuantitySelector quantity={product.quantity} />
            <Pressable
              className="h-14 flex-row items-center justify-center gap-3 rounded-lg bg-primary-900 active:bg-primary-800"
              onPress={() => router.push("/cart")}
            >
              <MaterialIcons name="shopping-bag" size={22} color="#ffffff" />
              <Text className="font-black uppercase tracking-widest text-white">
                Add To Cart
              </Text>
            </Pressable>
            <Pressable
              className="h-14 items-center justify-center rounded-lg bg-accent-700 active:bg-accent-800"
              onPress={() => router.push("/checkout")}
            >
              <Text className="font-black uppercase tracking-widest text-white">
                Buy Now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="mt-10 border-t border-neutral-200 pt-10">
        <Text className="mb-6 text-xl font-black uppercase tracking-tight text-primary-900">
          Technical Specifications
        </Text>
        <View className="gap-4">
          {specs.map((spec) => (
            <SpecRow key={spec.label} spec={spec} />
          ))}
        </View>
      </View>
    </View>
  );
}

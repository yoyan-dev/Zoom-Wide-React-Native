import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { type ProductListingItem, type ProductStatus } from "../types";

type ProductListingCardProps = {
  product: ProductListingItem;
};

const statusClassByStatus: Record<ProductStatus, string> = {
  "in-stock": "bg-accent-700 text-white",
  "limited-stock": "bg-neutral-800 text-white",
  "out-of-stock": "bg-red-700 text-white",
};

const statusLabelByStatus: Record<ProductStatus, string> = {
  "in-stock": "In Stock",
  "limited-stock": "Limited Stock",
  "out-of-stock": "Out of Stock",
};

export function ProductListingCard({ product }: ProductListingCardProps) {
  const router = useRouter();
  const unavailable = product.status === "out-of-stock";

  return (
    <Pressable
      className={unavailable ? "opacity-60" : ""}
      onPress={() => router.push("/product-detail")}
    >
      <View className="relative mb-4 aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-white p-4">
        <Image
          className="h-full w-full"
          resizeMode="contain"
          source={{ uri: product.image }}
        />
        <View
          className={[
            "absolute left-4 top-4 rounded px-3 py-1",
            statusClassByStatus[product.status],
          ].join(" ")}
        >
          <Text className="text-[10px] font-black uppercase tracking-widest text-white">
            {statusLabelByStatus[product.status]}
          </Text>
        </View>
      </View>

      <View>
        <Text className="text-xl font-black leading-tight tracking-tight text-primary-900">
          {product.name}
        </Text>
        <Text className="mt-1 text-sm font-semibold text-neutral-600">
          {product.specification}
        </Text>

        <View className="flex-row items-end justify-between gap-4 pt-4">
          <Text className="flex-1 text-2xl font-black text-primary-900">
            {product.price}{" "}
            <Text className="text-xs font-normal text-neutral-500">
              {product.unit}
            </Text>
          </Text>

          <Pressable
            className={[
              "h-10 w-10 items-center justify-center rounded-lg",
              unavailable ? "bg-neutral-300" : "bg-accent-600 active:bg-accent-700",
            ].join(" ")}
            disabled={unavailable}
            onPress={(event) => {
              event.stopPropagation();
              router.push("/cart");
            }}
          >
            <MaterialIcons
              color={unavailable ? "#667080" : "#ffffff"}
              name={unavailable ? "block" : "add-shopping-cart"}
              size={22}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

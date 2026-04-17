import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

import { homeStyles } from "../styles";

type ProductCardProps = {
  featured?: boolean;
  product: Product;
};

function ProductImage({ imageUrl }: { imageUrl?: string | null }) {
  if (!imageUrl) {
    return (
      <View className="h-full w-full items-center justify-center bg-neutral-100">
        <MaterialIcons name="inventory-2" size={36} color="#8E97A3" />
      </View>
    );
  }

  return (
    <Image
      className="h-full w-full opacity-90"
      resizeMode="cover"
      source={{ uri: imageUrl }}
    />
  );
}

export function ProductCard({ featured, product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const openProduct = () => {
    router.push(
      product.id
        ? {
            pathname: "/product-detail",
            params: { product_id: product.id },
          }
        : "/products",
    );
  };

  const handleAddToCart = async () => {
    if (!product.id || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      await addItem(product.id, 1);
      router.push("/cart");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to add this product to your cart right now.";
      Alert.alert("Cart unavailable", message);
    } finally {
      setIsAdding(false);
    }
  };

  if (featured) {
    return (
      <FeaturedProductCard
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        product={product}
      />
    );
  }

  return (
    <Pressable
      className="w-full rounded-xl bg-white p-5"
      onPress={openProduct}
      style={homeStyles.cardShadow}
    >
      <View className="mb-4 h-40 overflow-hidden rounded-lg bg-neutral-100">
        <ProductImage imageUrl={product.image_url} />
      </View>

      <Text className="mb-1 text-sm font-black uppercase tracking-tight text-primary-900">
        {product.name ?? product.sku ?? "Product"}
      </Text>
      <Text className="mb-4 text-xs font-semibold text-neutral-500">
        {product.description}
      </Text>

      <View className="mt-auto flex-row items-center justify-between">
        <Text className="text-lg font-black text-primary-900">
          {formatPhilippinePeso(product.price)}
        </Text>
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 active:opacity-70"
          disabled={!product.id || isAdding}
          onPress={(event) => {
            event.stopPropagation();
            void handleAddToCart();
          }}
        >
          {isAdding ? (
            <ActivityIndicator color="#0A2238" size="small" />
          ) : (
            <MaterialIcons name="add" size={22} color="#0A2238" />
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

function FeaturedProductCard({
  isAdding,
  onAddToCart,
  product,
}: ProductCardProps & {
  isAdding: boolean;
  onAddToCart: () => Promise<void>;
}) {
  const router = useRouter();
  const openProduct = () => {
    router.push(
      product.id
        ? {
            pathname: "/product-detail",
            params: { product_id: product.id },
          }
        : "/products",
    );
  };

  return (
    <Pressable
      className="w-full rounded-xl bg-white p-6"
      onPress={openProduct}
      style={homeStyles.cardShadow}
    >
      <View className="mb-6 h-64 overflow-hidden rounded-lg bg-neutral-100">
        <ProductImage imageUrl={product.image_url} />
      </View>

      <View className="gap-4">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="mb-1 text-2xl font-black uppercase tracking-tight text-primary-900">
              {product.name ?? product.sku ?? "Product"}
            </Text>
            <Text className="font-semibold text-neutral-500">
              {product.description}
            </Text>
          </View>

          <Text className="text-right text-2xl font-black text-primary-900">
            {formatPhilippinePeso(product.price)}{" "}
            {product.unit ? (
              <Text className="text-xs font-normal text-neutral-400">
                /{product.unit}
              </Text>
            ) : null}
          </Text>
        </View>

        <Pressable
          className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-primary-900 px-5 py-4 active:bg-primary-800"
          disabled={!product.id || isAdding}
          onPress={(event) => {
            event.stopPropagation();
            void onAddToCart();
          }}
        >
          {isAdding ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <MaterialIcons name="add-shopping-cart" size={22} color="#ffffff" />
          )}
          <Text className="text-sm font-black uppercase tracking-widest text-white">
            {isAdding ? "Adding..." : "Add To Order"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

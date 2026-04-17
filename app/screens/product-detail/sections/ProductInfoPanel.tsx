import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";

import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

import { QuantitySelector } from "../ui/QuantitySelector";
import { RatingStars } from "../ui/RatingStars";
import { SpecRow } from "../ui/SpecRow";

type ProductInfoPanelProps = {
  product: Product;
};

function getStockText(product: Product) {
  if (typeof product.stock_quantity !== "number") {
    return "Stock to be confirmed";
  }

  return `${product.stock_quantity.toLocaleString("en-PH")} units in stock`;
}

function getSpecs(product: Product) {
  return product.handbook?.specifications?.length
    ? product.handbook.specifications
    : [
        { label: "SKU", value: product.sku ?? "To be confirmed" },
        { label: "Unit", value: product.unit ?? "To be confirmed" },
        {
          label: "Category",
          value: product.category?.name ?? "To be confirmed",
        },
      ];
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const specs = getSpecs(product);
  const minimumQuantity = useMemo(
    () => Math.max(product.minimum_stock_quantity ?? 1, 1),
    [product.minimum_stock_quantity],
  );
  const [quantity, setQuantity] = useState(minimumQuantity);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setQuantity(minimumQuantity);
  }, [minimumQuantity, product.id]);

  const handleAddToCart = async () => {
    if (!product.id || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      await addItem(product.id, quantity);
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

  return (
    <View>
      <View className="mb-4">
        <Text className="mb-4 text-4xl font-black uppercase leading-none tracking-tighter text-primary-900">
          {product.name ?? product.sku ?? "Product"}
        </Text>
        <Text className="text-lg font-medium leading-8 text-neutral-600">
          {product.description ?? product.handbook?.summary ?? "No description available."}
        </Text>
      </View>

      <RatingStars />

      <View className="mb-8 rounded-xl bg-neutral-100 p-6">
        <View className="flex-row flex-wrap items-baseline gap-2">
          <Text className="text-4xl font-black text-primary-900">
            {formatPhilippinePeso(product.price)}
          </Text>
          {product.unit ? (
            <Text className="text-sm font-black uppercase text-neutral-500">
              /{product.unit}
            </Text>
          ) : null}
        </View>
        <View className="mt-2 flex-row items-center gap-2">
          <MaterialIcons name="local-shipping" size={16} color="#D87412" />
          <Text className="text-xs font-black uppercase tracking-widest text-accent-700">
            Delivery options calculated at checkout
          </Text>
        </View>
      </View>

      <View className="gap-6">
        <View className="gap-3">
          <View className="flex-row flex-wrap items-center justify-between gap-3">
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full bg-green-500" />
              <Text className="text-sm font-black uppercase tracking-tight text-green-700">
                {getStockText(product)}
              </Text>
            </View>
            <Text className="text-sm font-medium text-neutral-600">
              Ships from:{" "}
              <Text className="font-black text-primary-900">
                {product.warehouse?.name ?? "Nearest warehouse"}
              </Text>
            </Text>
          </View>

          <View className="gap-4">
            <QuantitySelector
              disabled={isAdding}
              onDecrease={() =>
                setQuantity((current) => Math.max(minimumQuantity, current - 1))
              }
              onIncrease={() => setQuantity((current) => current + 1)}
              quantity={quantity}
            />
            <Pressable
              className="h-14 flex-row items-center justify-center gap-3 rounded-lg bg-primary-900 active:bg-primary-800"
              disabled={!product.id || isAdding}
              onPress={() => void handleAddToCart()}
            >
              {isAdding ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <MaterialIcons name="shopping-bag" size={22} color="#ffffff" />
              )}
              <Text className="font-black uppercase tracking-widest text-white">
                {isAdding ? "Adding..." : "Add To Cart"}
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

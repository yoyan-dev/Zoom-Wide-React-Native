import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  fetchProductById,
  fetchProducts,
} from "@/services/productsApi";
import type { Product } from "@/types/product";

import { DetailTabs } from "./sections/DetailTabs";
import { ProductHero } from "./sections/ProductHero";
import { RelatedProducts } from "./sections/RelatedProducts";

export function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ product_id?: string }>();
  const productId = Array.isArray(params.product_id)
    ? params.product_id[0]
    : params.product_id;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const loadProductDetail = async (isActive = () => true) => {
    if (!productId) {
      setProduct(null);
      setRelatedProducts([]);
      setError("No product was selected.");
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);
    setProduct(null);
    setRelatedProducts([]);

    try {
      const nextProduct = await fetchProductById(productId);
      const nextRelatedProducts = nextProduct.category_id
        ? await fetchProducts({
            category_id: nextProduct.category_id,
            limit: 5,
          })
        : [];

      if (!isActive()) {
        return;
      }

      setProduct(nextProduct);
      setRelatedProducts(
        nextRelatedProducts.filter((item) => item.id !== nextProduct.id),
      );
    } catch (loadError) {
      if (!isActive()) {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load product details.",
      );
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    void loadProductDetail(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const retryLoadProductDetail = () => {
    void loadProductDetail();
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-4 pb-32 pt-8 md:px-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-7xl">
        {isLoading ? (
          <View className="items-center justify-center rounded-lg bg-white p-8">
            <ActivityIndicator color="#0A2238" />
            <Text className="mt-4 text-xs font-black uppercase tracking-widest text-neutral-500">
              Loading product
            </Text>
          </View>
        ) : null}

        {error ? (
          <View className="rounded-lg border border-red-100 bg-red-50 p-5">
            <Text className="text-base font-black text-red-700">
              Product unavailable
            </Text>
            <Text className="mt-2 text-sm font-semibold leading-5 text-red-700">
              {error}
            </Text>
            <View className="mt-4 flex-row flex-wrap gap-3">
              <Pressable
                className="rounded-lg bg-red-700 px-4 py-3 active:opacity-80"
                onPress={retryLoadProductDetail}
              >
                <Text className="text-xs font-black uppercase tracking-widest text-white">
                  Retry
                </Text>
              </Pressable>
              <Pressable
                className="rounded-lg bg-white px-4 py-3 active:opacity-80"
                onPress={() => router.push("/products")}
              >
                <Text className="text-xs font-black uppercase tracking-widest text-primary-900">
                  Browse Products
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {!isLoading && !error && product ? (
          <>
            <ProductHero product={product} />
            <DetailTabs product={product} />
            <RelatedProducts products={relatedProducts} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

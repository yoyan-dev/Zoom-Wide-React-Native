import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { fetchProducts } from "@/services/productsApi";
import { type Product } from "@/types/product";

import { FilterSortBar } from "./sections/FilterSortBar";
import { ProductGrid } from "./sections/ProductGrid";
import { ProductListingHeader } from "./sections/ProductListingHeader";
import { type ProductListingItem } from "./types";

function toProductStatus(product: Product): ProductListingItem["status"] {
  if ((product.stock_quantity ?? 0) <= 0) {
    return "out-of-stock";
  }

  if (
    typeof product.minimum_stock_quantity === "number" &&
    typeof product.stock_quantity === "number" &&
    product.stock_quantity <= product.minimum_stock_quantity * 2
  ) {
    return "limited-stock";
  }

  return "in-stock";
}

export function ProductListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category_id?: string; q?: string }>();
  const [products, setProducts] = useState<ProductListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextProducts = await fetchProducts({
        category_id:
          typeof params.category_id === "string" ? params.category_id : undefined,
        limit: 48,
        q: typeof params.q === "string" ? params.q : undefined,
      });

      setProducts(
        nextProducts
          .filter((product): product is ProductListingItem => Boolean(product.id))
          .map((product) => ({
            ...product,
            id: product.id as string,
            status: toProductStatus(product),
          })),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load products right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [params.category_id, params.q]);

  useFocusEffect(
    useCallback(() => {
      void loadProducts();
    }, [loadProducts]),
  );

  const headerTitle = useMemo(() => {
    const firstCategoryName = products[0]?.category?.name?.trim();

    if (firstCategoryName) {
      return firstCategoryName;
    }

    if (typeof params.q === "string" && params.q.trim()) {
      return "Search Results";
    }

    return "Products";
  }, [params.q, products]);

  const headerDescription = useMemo(() => {
    if (typeof params.q === "string" && params.q.trim()) {
      return `Live inventory results for "${params.q.trim()}". Review current product availability, pricing, and specifications before ordering.`;
    }

    if (products[0]?.category?.description?.trim()) {
      return products[0].category?.description?.trim() as string;
    }

    return "Browse live inventory from the Zoom Wide catalog, including current product availability, specifications, and pricing.";
  }, [params.q, products]);

  const filters = useMemo(() => {
    const inStock = products.filter((product) => product.status === "in-stock").length;
    const limited = products.filter(
      (product) => product.status === "limited-stock",
    ).length;

    return [
      `${products.length} Live Products`,
      `${inStock} In Stock`,
      `${limited} Limited Stock`,
    ];
  }, [products]);

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-7xl">
          <ProductListingHeader
            description={headerDescription}
            title={headerTitle}
          />
          <FilterSortBar
            filters={filters}
            sortLabel="Live Availability"
          />

          {isLoading ? (
            <View className="rounded-xl bg-white p-8">
              <ActivityIndicator color="#002A58" />
              <Text className="mt-4 text-xs font-black uppercase tracking-widest text-neutral-500">
                Loading products
              </Text>
            </View>
          ) : null}

          {error ? (
            <View className="rounded-xl border border-red-100 bg-red-50 p-5">
              <Text className="text-sm font-black text-red-700">{error}</Text>
            </View>
          ) : null}

          {!isLoading && !error && products.length === 0 ? (
            <View className="rounded-xl bg-white p-6">
              <Text className="text-xl font-black text-primary-900">
                No products found
              </Text>
              <Text className="mt-2 text-sm font-medium leading-6 text-neutral-600">
                Try another category or search term to explore available inventory.
              </Text>
            </View>
          ) : null}

          {!isLoading && !error && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : null}
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary-900 shadow-2xl active:scale-90"
        onPress={() => router.push("/profile")}
      >
        <MaterialIcons name="engineering" size={26} color="#ffffff" />
      </Pressable>
    </View>
  );
}

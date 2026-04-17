import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { fetchCategories } from "@/services/categoriesApi";
import { fetchProducts } from "@/services/productsApi";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import { CategoryList } from "./sections/CategoryList";
import { FeaturedMaterialsSection } from "./sections/FeaturedMaterialsSection";
import { PromoBanner } from "./sections/PromoBanner";
import { SearchTrackSection } from "./sections/SearchTrackSection";
import { TradeSupportSection } from "./sections/TradeSupportSection";

export function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHomeData = async (isActive = () => true) => {
    setError(null);
    setIsLoading(true);

    try {
      const [nextCategories, nextProducts] = await Promise.all([
        fetchCategories({ limit: 8 }),
        fetchProducts({ limit: 8 }),
      ]);

      if (!isActive()) {
        return;
      }

      setCategories(nextCategories);
      setProducts(nextProducts);
    } catch (loadError) {
      if (!isActive()) {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load home catalog data.",
      );
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    void loadHomeData(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  const retryLoadHomeData = () => {
    void loadHomeData();
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-28 pt-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-screen-xl">
        <SearchTrackSection />
        {isLoading ? (
          <View className="mb-10 items-center justify-center rounded-lg bg-white p-8">
            <ActivityIndicator color="#0A2238" />
            <Text className="mt-4 text-xs font-black uppercase tracking-widest text-neutral-500">
              Loading catalog
            </Text>
          </View>
        ) : null}

        {error ? (
          <View className="mb-10 rounded-lg border border-red-100 bg-red-50 p-5">
            <Text className="text-base font-black text-red-700">
              Catalog unavailable
            </Text>
            <Text className="mt-2 text-sm font-semibold leading-5 text-red-700">
              {error}
            </Text>
            <Pressable
              className="mt-4 self-start rounded-lg bg-red-700 px-4 py-3 active:opacity-80"
              onPress={retryLoadHomeData}
            >
              <Text className="text-xs font-black uppercase tracking-widest text-white">
                Retry
              </Text>
            </Pressable>
          </View>
        ) : null}

        {!isLoading && !error ? (
          <>
            <CategoryList categories={categories} />
            <PromoBanner />
            <FeaturedMaterialsSection products={products} />
          </>
        ) : null}
        <TradeSupportSection />
      </View>
    </ScrollView>
  );
}

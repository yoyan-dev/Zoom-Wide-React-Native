import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { fetchCategories } from "@/services/categoriesApi";
import { type Category } from "@/types/category";

import { CategoryTileCard } from "../ui/CategoryTileCard";

function getTileSize(index: number) {
  if (index === 1) {
    return "wide" as const;
  }

  if (index === 7) {
    return "tall" as const;
  }

  return "standard" as const;
}

export function CatalogGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async (isActive = () => true) => {
    setError(null);
    setIsLoading(true);

    try {
      const nextCategories = await fetchCategories({ limit: 24 });
      if (!isActive()) {
        return;
      }

      setCategories(nextCategories);
    } catch (loadError) {
      if (!isActive()) {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load categories.",
      );
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    void loadCategories(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  const retryLoadCategories = () => {
    void loadCategories();
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center rounded-lg bg-white p-8">
        <ActivityIndicator color="#0A2238" />
        <Text className="mt-4 text-xs font-black uppercase tracking-widest text-neutral-500">
          Loading categories
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="rounded-lg border border-red-100 bg-red-50 p-5">
        <Text className="text-base font-black text-red-700">
          Categories unavailable
        </Text>
        <Text className="mt-2 text-sm font-semibold leading-5 text-red-700">
          {error}
        </Text>
        <Pressable
          className="mt-4 self-start rounded-lg bg-red-700 px-4 py-3 active:opacity-80"
          onPress={retryLoadCategories}
        >
          <Text className="text-xs font-black uppercase tracking-widest text-white">
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className="rounded-lg bg-white p-6">
        <Text className="text-base font-black text-primary-900">
          No categories yet
        </Text>
        <Text className="mt-2 text-sm font-semibold text-neutral-500">
          Product categories will appear here once the catalog is published.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-6">
      <View className="flex flex-col gap-6">
        {categories.map((category, index) => {
          const size = getTileSize(index);

          return (
            <View
              className={[
                "flex-1",
                size === "wide" ? "min-w-full" : "min-w-[150px]",
              ].join(" ")}
              key={category.id}
            >
              <CategoryTileCard category={category} size={size} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

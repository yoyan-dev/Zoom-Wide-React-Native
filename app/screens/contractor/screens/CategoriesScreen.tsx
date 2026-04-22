import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { fetchCategories } from "@/services/categoriesApi";
import type { Category } from "@/types/category";

export function ContractorCategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void fetchCategories({ limit: 12 })
      .then((response) => {
        if (isMounted) {
          setCategories(response);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load material categories.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Bulk-friendly catalog sections for fast sourcing across your active jobs."
        title="Materials"
      />

      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState description={error} title="Catalog unavailable" />
      ) : (
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {categories.map((category) => (
            <Pressable
              className="w-[48%] rounded-[28px] bg-white p-5 active:opacity-85"
              key={category.id}
              onPress={() =>
                router.push({
                  pathname: "/products",
                  params: { category_id: category.id },
                })
              }
            >
              <View className="h-20 w-20 items-center justify-center rounded-[20px] bg-primary-50">
                <MaterialIcons color="#0A2238" name="category" size={30} />
              </View>
              <Text className="mt-4 text-lg font-black text-primary-900">
                {category.name}
              </Text>
              <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
                {category.description}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ContractorPage>
  );
}

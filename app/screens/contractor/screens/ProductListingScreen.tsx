import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { MaterialCard } from "@/app/screens/contractor/components/MaterialCard";
import { fetchProducts } from "@/services/productsApi";
import { useContractorOrderStore } from "@/store/contractorOrderStore";
import type { Product } from "@/types/product";

export function ContractorProductListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    category_id?: string | string[];
    project_id?: string | string[];
  }>();
  const categoryId = Array.isArray(params.category_id)
    ? params.category_id[0]
    : params.category_id;
  const projectId = Array.isArray(params.project_id)
    ? params.project_id[0]
    : params.project_id;
  const setProject = useContractorOrderStore((state) => state.setProject);
  const selectedProjectId = useContractorOrderStore(
    (state) => state.selectedProjectId,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (projectId) {
      setProject(projectId);
    }
  }, [projectId, setProject]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    void fetchProducts({
      category_id: categoryId,
      limit: 30,
    })
      .then((response) => {
        if (isMounted) {
          setProducts(response);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Unable to load materials.",
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
  }, [categoryId]);

  return (
    <ContractorPage>
      <ContractorSectionHeader
        actionLabel="Bulk Cart"
        onAction={() => router.push("/cart")}
        subtitle={
          selectedProjectId
            ? "Materials you add will stay tied to the selected project."
            : "Select a project before checkout so your order stays site-specific."
        }
        title="Product List"
      />

      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState description={error} title="Materials unavailable" />
      ) : (
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {products.map((product) => (
            <MaterialCard
              key={product.id}
              onPress={() =>
                router.push({
                  pathname: "/product-detail",
                  params: {
                    product_id: product.id,
                    project_id: selectedProjectId ?? projectId,
                  },
                })
              }
              product={product}
            />
          ))}
        </View>
      )}
    </ContractorPage>
  );
}

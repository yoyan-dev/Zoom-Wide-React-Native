import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { fetchProductById } from "@/services/productsApi";
import { useContractorOrderStore } from "@/store/contractorOrderStore";
import type { Product } from "@/types/product";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function ContractorProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    product_id?: string | string[];
    project_id?: string | string[];
  }>();
  const productId = Array.isArray(params.product_id)
    ? params.product_id[0]
    : params.product_id;
  const projectId = Array.isArray(params.project_id)
    ? params.project_id[0]
    : params.project_id;
  const addItem = useContractorOrderStore((state) => state.addItem);
  const setProject = useContractorOrderStore((state) => state.setProject);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("10");

  useEffect(() => {
    if (projectId) {
      setProject(projectId);
    }
  }, [projectId, setProject]);

  useEffect(() => {
    if (!productId) {
      setError("No product selected.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    void fetchProductById(productId)
      .then((response) => {
        if (isMounted) {
          setProduct(response);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load material details.",
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
  }, [productId]);

  const bulkQuantity = Math.max(Number(quantity) || 0, 0);

  return (
    <ContractorPage>
      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error || !product ? (
        <ContractorEmptyState
          actionLabel="Back to materials"
          description={error || "This material could not be loaded."}
          onAction={() => router.push("/products")}
          title="Material unavailable"
        />
      ) : (
        <View className="overflow-hidden rounded-[32px] bg-white">
          <View className="h-72 bg-neutral-100">
            {product.image_url ? (
              <Image
                className="h-full w-full"
                resizeMode="cover"
                source={{ uri: product.image_url }}
              />
            ) : (
              <View className="h-full items-center justify-center bg-primary-50">
                <MaterialIcons color="#0A2238" name="inventory-2" size={44} />
              </View>
            )}
          </View>
          <View className="p-5">
            <Text className="text-[11px] font-black uppercase tracking-[3px] text-accent-700">
              Bulk material
            </Text>
            <Text className="mt-2 text-3xl font-black text-primary-900">
              {product.name}
            </Text>
            <Text className="mt-3 text-base font-semibold text-accent-700">
              {formatPhilippinePeso(product.price ?? 0)} / {product.unit ?? "unit"}
            </Text>
            <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
              {product.description ||
                "Reliable contractor-grade stock for active site demand."}
            </Text>

            <View className="mt-6 flex-row flex-wrap gap-3">
              <View className="min-w-[120px] flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                  Stock
                </Text>
                <Text className="mt-2 text-sm font-black text-primary-900">
                  {product.stock_quantity ?? 0} available
                </Text>
              </View>
              <View className="min-w-[120px] flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4">
                <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-400">
                  Unit
                </Text>
                <Text className="mt-2 text-sm font-black text-primary-900">
                  {product.unit ?? "unit"}
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
                Quantity
              </Text>
              <View className="flex-row items-center gap-3">
                <Pressable
                  className="h-12 w-12 items-center justify-center rounded-[18px] bg-[#F3F5F7]"
                  onPress={() =>
                    setQuantity(String(Math.max((Number(quantity) || 1) - 1, 1)))
                  }
                >
                  <MaterialIcons color="#0A2238" name="remove" size={20} />
                </Pressable>
                <TextInput
                  className="flex-1 rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-center text-xl font-black text-primary-900"
                  keyboardType="number-pad"
                  onChangeText={setQuantity}
                  value={quantity}
                />
                <Pressable
                  className="h-12 w-12 items-center justify-center rounded-[18px] bg-[#F3F5F7]"
                  onPress={() => setQuantity(String((Number(quantity) || 0) + 1))}
                >
                  <MaterialIcons color="#0A2238" name="add" size={20} />
                </Pressable>
              </View>
            </View>

            <View className="mt-8 flex-row gap-3">
              <Pressable
                className="flex-1 items-center rounded-[22px] bg-primary-900 px-4 py-4 active:bg-primary-800"
                onPress={() => {
                  addItem(product, bulkQuantity || 1);
                  router.push("/cart");
                }}
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                  Add To Bulk Order
                </Text>
              </Pressable>
              <Pressable
                className="items-center rounded-[22px] border border-neutral-300 px-4 py-4 active:bg-neutral-100"
                onPress={() => router.back()}
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-primary-900">
                  Back
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ContractorPage>
  );
}

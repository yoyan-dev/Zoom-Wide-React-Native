import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import { fetchProjects } from "@/services/projectsApi";
import { useContractorOrderStore } from "@/store/contractorOrderStore";
import type { Project } from "@/types/project";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function ContractorCartScreen() {
  const router = useRouter();
  const { accessToken } = useContractorSession();
  const items = useContractorOrderStore((state) => state.items);
  const removeItem = useContractorOrderStore((state) => state.removeItem);
  const selectedProjectId = useContractorOrderStore(
    (state) => state.selectedProjectId,
  );
  const setProject = useContractorOrderStore((state) => state.setProject);
  const setQuantity = useContractorOrderStore((state) => state.setQuantity);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void fetchProjects(accessToken, { limit: 50 })
      .then(setProjects)
      .catch(() => {
        setProjects([]);
      });
  }, [accessToken]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Review your material list, adjust quantities, and pin the order to the correct project."
        title="Bulk Order Cart"
      />

      {items.length === 0 ? (
        <ContractorEmptyState
          actionLabel="Browse Materials"
          description="Add contractor materials from the catalog to start a bulk order."
          onAction={() => router.push("/categories")}
          title="Your bulk cart is empty"
        />
      ) : (
        <>
          <View className="rounded-[30px] bg-white p-5">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
              Select Project
            </Text>
            <ScrollView
              className="mt-4"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-row gap-3">
                {projects.map((project) => {
                  const isActive = selectedProjectId === project.id;

                  return (
                    <Pressable
                      className={[
                        "rounded-[22px] px-4 py-4",
                        isActive ? "bg-primary-900" : "bg-[#F3F5F7]",
                      ].join(" ")}
                      key={project.id}
                      onPress={() => setProject(project.id)}
                    >
                      <Text
                        className={[
                          "text-sm font-black",
                          isActive ? "text-white" : "text-primary-900",
                        ].join(" ")}
                      >
                        {project.name}
                      </Text>
                      <Text
                        className={[
                          "mt-1 text-xs font-semibold",
                          isActive ? "text-primary-100" : "text-neutral-500",
                        ].join(" ")}
                      >
                        {project.location ?? "Project site"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View className="mt-6 gap-4">
            {items.map((item) => (
              <View className="rounded-[28px] bg-white p-5" key={item.productId}>
                <View className="flex-row gap-4">
                  <View className="h-20 w-20 overflow-hidden rounded-[20px] bg-neutral-100">
                    {item.imageUrl ? (
                      <Image
                        className="h-full w-full"
                        resizeMode="cover"
                        source={{ uri: item.imageUrl }}
                      />
                    ) : (
                      <View className="h-full items-center justify-center bg-primary-50">
                        <MaterialIcons color="#0A2238" name="inventory-2" size={24} />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-black text-primary-900">
                      {item.name}
                    </Text>
                    <Text className="mt-1 text-sm font-medium text-neutral-500">
                      {formatPhilippinePeso(item.price)} / {item.unit}
                    </Text>
                    <View className="mt-4 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <Pressable
                          className="h-10 w-10 items-center justify-center rounded-[16px] bg-[#F3F5F7]"
                          onPress={() =>
                            setQuantity(item.productId, Math.max(item.quantity - 1, 0))
                          }
                        >
                          <MaterialIcons color="#0A2238" name="remove" size={18} />
                        </Pressable>
                        <Text className="min-w-[28px] text-center text-lg font-black text-primary-900">
                          {item.quantity}
                        </Text>
                        <Pressable
                          className="h-10 w-10 items-center justify-center rounded-[16px] bg-[#F3F5F7]"
                          onPress={() => setQuantity(item.productId, item.quantity + 1)}
                        >
                          <MaterialIcons color="#0A2238" name="add" size={18} />
                        </Pressable>
                      </View>
                      <Pressable onPress={() => removeItem(item.productId)}>
                        <Text className="text-xs font-black uppercase tracking-[2px] text-rose-700">
                          Remove
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-6 rounded-[30px] bg-primary-900 p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
                Total Cost
              </Text>
              <Text className="text-2xl font-black text-white">
                {formatPhilippinePeso(total)}
              </Text>
            </View>
            <Pressable
              className="mt-5 items-center rounded-[22px] bg-accent-600 px-4 py-4 active:opacity-90"
              onPress={() => router.push("/checkout")}
            >
              <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                Continue To Checkout
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </ContractorPage>
  );
}

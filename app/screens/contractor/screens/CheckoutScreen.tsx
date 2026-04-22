import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { PAYMENT_OPTIONS } from "@/app/screens/contractor/constants";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import { createOrder } from "@/services/ordersApi";
import { type ContractorPaymentMethod, useContractorOrderStore } from "@/store/contractorOrderStore";
import { formatPhilippinePeso } from "@/utils/formatCurrency";

export function ContractorCheckoutScreen() {
  const router = useRouter();
  const { accessToken, customer } = useContractorSession();
  const clearOrder = useContractorOrderStore((state) => state.clearOrder);
  const items = useContractorOrderStore((state) => state.items);
  const selectedProjectId = useContractorOrderStore(
    (state) => state.selectedProjectId,
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    customer?.shipping_address ?? "",
  );
  const [deliverySchedule, setDeliverySchedule] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<ContractorPaymentMethod>("gcash");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handlePlaceOrder = async () => {
    if (!accessToken || !customer?.id) {
      setError("Sign in again before placing this order.");
      return;
    }

    if (!selectedProjectId) {
      setError("Select a project in the bulk cart before checkout.");
      return;
    }

    if (items.length === 0) {
      setError("Add materials to your bulk order before checkout.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const order = await createOrder(accessToken, {
        customer_id: customer.id,
        items: items.map((item) => ({
          line_total: item.price * item.quantity,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        notes: [
          deliveryAddress ? `Delivery address: ${deliveryAddress}` : null,
          deliverySchedule ? `Delivery schedule: ${deliverySchedule}` : null,
          `Payment method: ${paymentMethod.toUpperCase()}`,
          notes.trim() || null,
        ]
          .filter(Boolean)
          .join("\n"),
        project_id: selectedProjectId,
        total_amount: total,
      });

      clearOrder();
      router.replace({
        pathname: "/order-detail",
        params: { order_id: order.id },
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to place your contractor order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Confirm the site delivery details and payment preference before submitting the order."
        title="Checkout"
      />

      <View className="gap-5">
        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Delivery address
          </Text>
          <TextInput
            className="mt-3 min-h-[120px] rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
            multiline
            onChangeText={setDeliveryAddress}
            placeholder="Enter site delivery address"
            placeholderTextColor="#94A3B8"
            textAlignVertical="top"
            value={deliveryAddress}
          />
        </View>

        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Delivery schedule
          </Text>
          <TextInput
            className="mt-3 rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
            onChangeText={setDeliverySchedule}
            placeholder="2026-05-12 08:00 AM"
            placeholderTextColor="#94A3B8"
            value={deliverySchedule}
          />
        </View>

        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Notes for supplier
          </Text>
          <TextInput
            className="mt-3 min-h-[120px] rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
            multiline
            onChangeText={setNotes}
            placeholder="Site gate instructions, unloading notes, contact person..."
            placeholderTextColor="#94A3B8"
            textAlignVertical="top"
            value={notes}
          />
        </View>

        <View className="rounded-[30px] bg-white p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
            Payment method
          </Text>
          <View className="mt-4 gap-3">
            {PAYMENT_OPTIONS.map((option) => {
              const isActive = paymentMethod === option.value;

              return (
                <Pressable
                  className={[
                    "rounded-[22px] border px-4 py-4",
                    isActive
                      ? "border-primary-900 bg-primary-900"
                      : "border-neutral-200 bg-[#F3F5F7]",
                  ].join(" ")}
                  key={option.value}
                  onPress={() => setPaymentMethod(option.value)}
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons
                      color={isActive ? "#FFFFFF" : "#0A2238"}
                      name={option.icon}
                      size={22}
                    />
                    <View className="flex-1">
                      <Text
                        className={[
                          "text-sm font-black uppercase tracking-[2px]",
                          isActive ? "text-white" : "text-primary-900",
                        ].join(" ")}
                      >
                        {option.label}
                      </Text>
                      <Text
                        className={[
                          "mt-1 text-sm font-medium leading-5",
                          isActive ? "text-primary-100" : "text-neutral-500",
                        ].join(" ")}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="rounded-[30px] bg-primary-900 p-5">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-primary-100">
            Total cost
          </Text>
          <Text className="mt-2 text-3xl font-black text-white">
            {formatPhilippinePeso(total)}
          </Text>

          {error ? (
            <View className="mt-4 rounded-[18px] bg-white/10 px-4 py-3">
              <Text className="text-sm font-semibold text-white">{error}</Text>
            </View>
          ) : null}

          <Pressable
            className="mt-5 items-center rounded-[22px] bg-accent-600 px-4 py-4 active:opacity-90"
            onPress={() => void handlePlaceOrder()}
          >
            <Text className="text-xs font-black uppercase tracking-[2px] text-white">
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ContractorPage>
  );
}

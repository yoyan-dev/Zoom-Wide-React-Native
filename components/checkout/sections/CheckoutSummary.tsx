import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import {
  checkoutItems,
  checkoutTotals,
  grandTotal,
} from "../data";
import { checkoutStyles } from "../styles";
import { SummaryProductRow } from "../ui/SummaryProductRow";
import { TotalLine } from "../ui/TotalLine";

export function CheckoutSummary() {
  const router = useRouter();

  return (
    <View className="gap-6">
      <View
        className="rounded-xl border border-neutral-200 bg-white p-8"
        style={checkoutStyles.summaryShadow}
      >
        <Text className="mb-8 border-b border-neutral-100 pb-4 text-xl font-black uppercase tracking-widest text-primary-900">
          Order Summary
        </Text>

        <View className="mb-8 gap-6">
          {checkoutItems.map((item) => (
            <SummaryProductRow item={item} key={item.id} />
          ))}
        </View>

        <View className="mb-8 gap-3 border-t border-neutral-100 pt-6">
          {checkoutTotals.map((line) => (
            <TotalLine key={line.label} line={line} />
          ))}
        </View>

        <View className="mb-8 flex-row items-end justify-between gap-4">
          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Grand Total
            </Text>
            <Text className="text-4xl font-black text-primary-900">
              {grandTotal}
            </Text>
          </View>
          <View className="rounded-full bg-green-100 px-3 py-1">
            <Text className="text-[10px] font-black uppercase tracking-widest text-green-700">
              Pro Discount Applied
            </Text>
          </View>
        </View>

        <Pressable
          className="flex-row items-center justify-center gap-3 rounded-lg bg-primary-900 py-5 shadow-xl active:bg-primary-800"
          onPress={() => router.replace("/order-success")}
        >
          <Text className="text-sm font-black uppercase tracking-widest text-white">
            Place Order
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
        </Pressable>
      </View>

      <View className="flex-row items-start gap-4 rounded-xl border border-primary-100 bg-primary-50 p-6">
        <MaterialIcons name="verified-user" size={24} color="#0A2238" />
        <View className="flex-1">
          <Text className="mb-1 text-xs font-black uppercase tracking-widest text-primary-900">
            Architectural Guarantee
          </Text>
          <Text className="text-xs font-medium leading-5 text-neutral-600">
            Your transaction is secured with enterprise-grade encryption. Every
            order is inspected for structural compliance before shipping.
          </Text>
        </View>
      </View>
    </View>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { orderTotal, summaryLines } from "../data";
import { cartStyles } from "../styles";
import { SummaryLineItem } from "../ui/SummaryLineItem";
import { TradeGuarantee } from "../ui/TradeGuarantee";

export function OrderSummary() {
  const router = useRouter();

  return (
    <View
      className="rounded-xl bg-neutral-100 p-8"
      style={cartStyles.summaryShadow}
    >
      <Text className="text-2xl font-black uppercase tracking-tight text-primary-900">
        Order Summary
      </Text>

      <View className="mt-8 gap-4">
        {summaryLines.map((line) => (
          <SummaryLineItem key={line.label} line={line} />
        ))}

        <View className="mt-4 border-t border-neutral-300 pt-4">
          <View className="flex-row items-center justify-between gap-4">
            <Text className="flex-1 text-sm font-black uppercase tracking-widest text-primary-900">
              Total Amount
            </Text>
            <Text className="text-3xl font-black text-primary-900">
              {orderTotal}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-8 gap-4">
        <Pressable
          className="rounded-lg bg-primary-900 py-4 active:bg-primary-800"
          onPress={() => router.push("/checkout")}
        >
          <Text className="text-center text-sm font-black uppercase tracking-widest text-white">
            Proceed To Checkout
          </Text>
        </Pressable>

        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 py-4 active:bg-white"
          onPress={() => router.push("/order-tracking")}
        >
          <MaterialIcons name="local-shipping" size={20} color="#111418" />
          <Text className="text-sm font-black uppercase tracking-widest text-neutral-900">
            Estimate Arrival
          </Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <TradeGuarantee />
      </View>
    </View>
  );
}

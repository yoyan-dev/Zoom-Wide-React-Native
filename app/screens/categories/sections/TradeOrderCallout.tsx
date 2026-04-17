import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { tradeBenefits } from "../data";
import { TradeBenefitRow } from "../ui/TradeBenefitRow";

export function TradeOrderCallout() {
  const router = useRouter();

  return (
    <View className="mt-16 overflow-hidden rounded-xl bg-primary-900 p-8">
      <View className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-600 opacity-10" />

      <View className="gap-8">
        <View>
          <Text className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
            Bulk Trade Orders
          </Text>
          <Text className="mb-8 text-lg font-medium leading-8 text-primary-200">
            Are you a licensed contractor or developer? Access exclusive
            wholesale pricing and logistical support for large-scale projects.
          </Text>

          <Pressable
            className="self-start rounded bg-accent-600 px-8 py-4 active:bg-accent-700"
            onPress={() => router.push("/profile")}
          >
            <Text className="text-sm font-black uppercase tracking-widest text-white">
              Open Trade Account
            </Text>
          </Pressable>
        </View>

        <View className="gap-4 rounded-lg border border-white/10 bg-white/10 p-6">
          {tradeBenefits.map((benefit) => (
            <TradeBenefitRow benefit={benefit} key={benefit.label} />
          ))}
        </View>
      </View>
    </View>
  );
}

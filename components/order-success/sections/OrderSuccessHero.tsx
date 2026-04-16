import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { orderSuccess, successBenefits } from "../data";
import { orderSuccessStyles } from "../styles";
import { OrderReferenceCard } from "../ui/OrderReferenceCard";
import { SuccessBenefitCard } from "../ui/SuccessBenefitCard";

export function OrderSuccessHero() {
  const router = useRouter();

  return (
    <View className="relative flex-1 overflow-hidden px-6 py-12">
      <View className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-100 opacity-50" />
      <View className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-100 opacity-50" />

      <View className="relative z-10 mx-auto w-full max-w-4xl items-center gap-12">
        <View className="items-center gap-6">
          <View className="relative">
            <View
              className="h-24 w-24 items-center justify-center rounded-full bg-accent-600"
              style={orderSuccessStyles.successShadow}
            >
              <MaterialIcons name="check-circle" size={56} color="#ffffff" />
            </View>
            <View className="absolute -right-2 -top-2 h-8 w-8 rotate-12 items-center justify-center rounded-lg bg-primary-900">
              <MaterialIcons name="celebration" size={16} color="#ffffff" />
            </View>
          </View>

          <View className="items-center gap-4">
            <Text className="text-center text-4xl font-black uppercase leading-none tracking-tighter text-primary-900">
              {orderSuccess.title}
            </Text>
            <Text className="max-w-md text-center font-medium leading-6 text-neutral-600">
              {orderSuccess.message}
            </Text>
          </View>
        </View>

        <OrderReferenceCard />

        <View className="w-full gap-4 px-4">
          <Pressable
            className="rounded-lg bg-primary-900 px-10 py-4 active:bg-primary-800"
            onPress={() => router.push("/order-tracking")}
          >
            <Text className="text-center text-sm font-black uppercase tracking-widest text-white">
              Track Order
            </Text>
          </Pressable>
          <Pressable
            className="rounded-lg bg-neutral-200 px-10 py-4 active:bg-neutral-300"
            onPress={() => router.replace("/")}
          >
            <Text className="text-center text-sm font-black uppercase tracking-widest text-primary-900">
              Continue Shopping
            </Text>
          </Pressable>
        </View>

        <View className="w-full gap-6 pt-8">
          {successBenefits.map((benefit) => (
            <SuccessBenefitCard benefit={benefit} key={benefit.title} />
          ))}
        </View>
      </View>
    </View>
  );
}

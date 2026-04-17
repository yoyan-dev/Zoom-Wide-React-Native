import { Text, View } from "react-native";

import { orderDetails, orderSuccess } from "../data";
import { orderSuccessStyles } from "../styles";

export function OrderReferenceCard() {
  return (
    <View
      className="mx-auto w-full max-w-md rounded-xl border border-neutral-100 bg-white p-8"
      style={orderSuccessStyles.cardShadow}
    >
      <View className="items-center gap-2">
        <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Order Reference
        </Text>
        <Text className="text-2xl font-black uppercase tracking-widest text-primary-900">
          {orderSuccess.reference}
        </Text>
      </View>

      <View className="mt-6 flex-row gap-4 border-t border-neutral-100 pt-6">
        {orderDetails.map((detail) => (
          <View className="flex-1" key={detail.label}>
            <Text className="text-[10px] font-black uppercase text-neutral-400">
              {detail.label}
            </Text>
            <Text className="mt-1 text-sm font-black text-neutral-900">
              {detail.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

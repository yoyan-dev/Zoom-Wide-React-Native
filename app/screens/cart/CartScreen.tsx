import { ScrollView, Text, View } from "react-native";

import { cartItems } from "./data";
import { OrderSummary } from "./sections/OrderSummary";
import { CartItemCard } from "./ui/CartItemCard";
import { SecurePaymentNote } from "./ui/SecurePaymentNote";

export function CartScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-32 pt-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-5xl">
        <View className="mb-10">
          <Text className="text-4xl font-black uppercase tracking-tighter text-primary-900">
            Shopping Cart
          </Text>
          <Text className="mt-2 font-semibold uppercase tracking-wide text-neutral-600">
            3 items reserved for project specs
          </Text>
        </View>

        <View className="gap-8">
          <View className="gap-6">
            {cartItems.map((item) => (
              <CartItemCard item={item} key={item.id} />
            ))}
          </View>

          <View>
            <OrderSummary />
            <SecurePaymentNote />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

import { ScrollView, View } from "react-native";

import { CheckoutFooter } from "./sections/CheckoutFooter";
import { CheckoutForm } from "./sections/CheckoutForm";
import { CheckoutHeader } from "./sections/CheckoutHeader";
import { CheckoutSummary } from "./sections/CheckoutSummary";

export function CheckoutScreen() {
  return (
    <View className="flex-1 bg-neutral-50">
      <CheckoutHeader />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-6xl gap-12">
          <CheckoutForm />
          <CheckoutSummary />
        </View>

        <CheckoutFooter />
      </ScrollView>
    </View>
  );
}

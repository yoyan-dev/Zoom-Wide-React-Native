import { ScrollView, View } from "react-native";

import { OrderSuccessFooter } from "./sections/OrderSuccessFooter";
import { OrderSuccessHeader } from "./sections/OrderSuccessHeader";
import { OrderSuccessHero } from "./sections/OrderSuccessHero";

export function OrderSuccessScreen() {
  return (
    <View className="flex-1 bg-neutral-50">
      <OrderSuccessHeader />

      <ScrollView
        className="flex-1"
        contentContainerClassName="grow"
        showsVerticalScrollIndicator={false}
      >
        <OrderSuccessHero />
        <OrderSuccessFooter />
      </ScrollView>
    </View>
  );
}

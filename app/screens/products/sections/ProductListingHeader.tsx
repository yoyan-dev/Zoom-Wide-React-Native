import { Text, View } from "react-native";

import { Breadcrumbs } from "../ui/Breadcrumbs";

export function ProductListingHeader() {
  return (
    <View className="mb-10">
      <Breadcrumbs />
      <Text className="mb-4 text-5xl font-black uppercase leading-none tracking-tighter text-primary-900">
        Steel Bars
      </Text>
      <Text className="max-w-2xl text-lg font-medium leading-8 text-neutral-600">
        High-tensile reinforcement bars for structural integrity. Sourced from
        certified foundries for precision engineering.
      </Text>
    </View>
  );
}

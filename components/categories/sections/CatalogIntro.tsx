import { Text, View } from "react-native";

export function CatalogIntro() {
  return (
    <View className="mb-12">
      <View className="mb-2 flex-row items-center gap-2">
        <View className="h-0.5 w-12 bg-accent-600" />
        <Text className="text-xs font-black uppercase tracking-widest text-accent-700">
          Industrial Catalog
        </Text>
      </View>

      <Text className="mb-4 text-5xl font-black uppercase leading-none tracking-tighter text-primary-900">
        BUILDING{"\n"}
        <Text className="text-accent-600">ESSENTIALS</Text>
      </Text>

      <Text className="max-w-md text-base font-medium leading-7 text-neutral-600">
        Precision-engineered materials for structural integrity. Sourced from
        certified manufacturers for professional-grade construction projects.
      </Text>
    </View>
  );
}

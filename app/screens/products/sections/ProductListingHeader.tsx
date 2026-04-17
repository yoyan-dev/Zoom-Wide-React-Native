import { Text, View } from "react-native";

import { Breadcrumbs } from "../ui/Breadcrumbs";

type ProductListingHeaderProps = {
  title: string;
  description: string;
};

export function ProductListingHeader({
  description,
  title,
}: ProductListingHeaderProps) {
  return (
    <View className="mb-10">
      <Breadcrumbs currentLabel={title} />
      <Text className="mb-4 text-5xl font-black uppercase leading-none tracking-tighter text-primary-900">
        {title}
      </Text>
      <Text className="max-w-2xl text-lg font-medium leading-8 text-neutral-600">
        {description}
      </Text>
    </View>
  );
}

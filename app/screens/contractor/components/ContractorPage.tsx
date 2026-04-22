import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export function ContractorPage({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      className="flex-1 bg-[#F3F5F7]"
      contentContainerClassName="px-5 pb-32 pt-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-screen-md">{children}</View>
    </ScrollView>
  );
}

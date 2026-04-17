import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { detailCopy } from "../data";

const tabs = ["Description", "Certification", "Bulk Shipping"];

export function DetailTabs() {
  const router = useRouter();

  return (
    <View className="mt-20">
      <View className="mb-8 flex-row gap-8 border-b border-neutral-300">
        {tabs.map((tab, index) => (
          <Text
            className={[
              "pb-4 text-lg font-black uppercase tracking-widest",
              index === 0
                ? "border-b-4 border-accent-600 text-primary-900"
                : "text-neutral-400",
            ].join(" ")}
            key={tab}
          >
            {tab}
          </Text>
        ))}
      </View>

      <View className="gap-12">
        <View className="gap-4">
          {detailCopy.map((paragraph) => (
            <Text
              className="text-base font-medium leading-8 text-neutral-600"
              key={paragraph}
            >
              {paragraph}
            </Text>
          ))}
        </View>

        <View className="rounded-xl bg-neutral-800 p-8">
          <MaterialIcons name="engineering" size={40} color="#D87412" />
          <Text className="mt-4 text-xl font-black text-white">
            Trade Professional Portal
          </Text>
          <Text className="mt-2 text-sm font-medium leading-6 text-neutral-300">
            Unlock bulk pricing tiers and technical CAD drawings for your
            project. Verified accounts only.
          </Text>
          <Pressable
            className="mt-6 self-start rounded border border-neutral-500 px-6 py-2 active:bg-white/10"
            onPress={() => router.push("/profile")}
          >
            <Text className="text-sm font-black uppercase tracking-widest text-white">
              Access Portal
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

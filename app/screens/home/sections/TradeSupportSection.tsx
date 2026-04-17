import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function TradeSupportSection() {
  const router = useRouter();

  return (
    <View className="mb-12 rounded-2xl border-l-[6px] border-accent-600 bg-neutral-100 p-8">
      <View className="items-start gap-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-accent-100">
          <MaterialIcons name="engineering" size={40} color="#D87412" />
        </View>

        <View>
          <Text className="mb-2 text-2xl font-black uppercase tracking-tight text-primary-900">
            Dedicated Support for Trade Partners
          </Text>
          <Text className="max-w-2xl text-base font-medium leading-7 text-neutral-600">
            Unlock project-specific pricing, priority shipping, and a dedicated
            account manager for your construction firm.
          </Text>
        </View>

        <Pressable
          className="rounded-lg bg-primary-900 px-8 py-4 active:bg-primary-800"
          onPress={() => router.push("/profile")}
        >
          <Text className="text-sm font-black uppercase tracking-widest text-white">
            Apply For Trade
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

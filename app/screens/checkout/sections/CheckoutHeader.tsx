import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function CheckoutHeader() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-neutral-50/90" edges={["top"]}>
      <View className="flex-row items-center justify-between bg-neutral-50/90 px-6 py-4 shadow-sm">
        <View className="flex-row items-center gap-4">
          <Pressable
            className="active:scale-95 active:opacity-70"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={26} color="#0A2238" />
          </Pressable>
          <Text className="text-xl font-black uppercase tracking-widest text-primary-900">
            ZOOM WIDE
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <MaterialIcons name="lock" size={20} color="#667080" />
          <Text className="text-xs font-black uppercase tracking-widest text-neutral-500">
            Secure Checkout
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

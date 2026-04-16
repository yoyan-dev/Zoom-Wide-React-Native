import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function AppHeader() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-neutral-50/90" edges={["top"]}>
      <View className="flex-row items-center justify-between bg-neutral-50/90 px-6 py-4 shadow-sm">
        <Pressable
          className="items-center justify-center active:scale-95 active:opacity-70"
          onPress={() => router.push("/profile")}
        >
          <MaterialIcons name="menu" size={26} color="#0A2238" />
        </Pressable>

        <Text className="text-xl font-black uppercase tracking-widest text-primary-900">
          ZOOM WIDE
        </Text>

        <Pressable
          className="items-center justify-center active:scale-95 active:opacity-70"
          onPress={() => router.push("/products")}
        >
          <MaterialIcons name="search" size={26} color="#0A2238" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

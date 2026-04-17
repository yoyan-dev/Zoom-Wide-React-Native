import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export function SearchTrackSection() {
  const router = useRouter();

  return (
    <View className="mb-8 gap-4">
      <View className="relative h-14 justify-center rounded-lg bg-neutral-200">
        <MaterialIcons
          name="search"
          size={22}
          color="#8E97A3"
          style={{ left: 16, position: "absolute", zIndex: 1 }}
        />
        <TextInput
          className="h-14 rounded-lg px-12 text-base font-semibold text-neutral-900"
          onSubmitEditing={() => router.push("/products")}
          placeholder="Search industrial equipment..."
          placeholderTextColor="#8E97A3"
          returnKeyType="search"
        />
      </View>

      <Pressable
        className="h-14 flex-row items-center justify-center gap-3 rounded-lg bg-white px-6 active:opacity-70"
        onPress={() => router.push("/order-tracking")}
      >
        <MaterialIcons name="local-shipping" size={24} color="#0A2238" />
        <Text className="font-black tracking-tight text-primary-900">
          Track Order
        </Text>
      </Pressable>
    </View>
  );
}

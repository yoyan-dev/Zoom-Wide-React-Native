import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useAuthStore } from "@/store/authStore";

import { type ProfileOption } from "../types";

type ProfileOptionRowProps = {
  option: ProfileOption;
};

export function ProfileOptionRow({ option }: ProfileOptionRowProps) {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);

  const handlePress = () => {
    switch (option.label) {
      case "Settings":
        router.push("/edit-profile");
        return;
      case "Security Settings":
        router.push("/security-settings");
        return;
      case "Order History":
        router.push("/orders");
        return;
      case "Saved Addresses":
        router.push("/delivery-addresses");
        return;
      case "Wishlist":
        router.push("/products");
        return;
      default:
        router.push("/profile");
    }
  };

  if (option.destructive) {
    const handleSignOut = async () => {
      await signOut();
      router.replace("/login");
    };

    return (
      <Pressable
        className="flex-row items-center justify-between rounded-xl border-l-4 border-red-700 bg-red-50 p-5 active:opacity-80"
        onPress={handleSignOut}
      >
        <View className="flex-row items-center gap-4">
          <View className="h-10 w-10 items-center justify-center rounded-lg">
            <MaterialIcons name={option.icon} size={24} color="#BA1A1A" />
          </View>
          <Text className="font-black text-red-700">{option.label}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      className="flex-row items-center justify-between rounded-xl bg-white p-5 active:bg-neutral-100"
      onPress={handlePress}
    >
      <View className="flex-row items-center gap-4">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
          <MaterialIcons name={option.icon} size={23} color="#0A2238" />
        </View>
        <Text className="font-black text-primary-900">{option.label}</Text>
      </View>

      <View className="flex-row items-center gap-3">
        {option.badge ? (
          <View className="rounded-full bg-accent-700 px-2 py-0.5">
            <Text className="text-[10px] font-black text-white">
              {option.badge}
            </Text>
          </View>
        ) : null}
        <MaterialIcons name="chevron-right" size={24} color="#C3C6D2" />
      </View>
    </Pressable>
  );
}

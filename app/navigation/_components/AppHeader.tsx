import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useContractorOrderStore } from "@/store/contractorOrderStore";
import { isContractorCustomer } from "@/utils/customerAccess";

export function AppHeader() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const loadCart = useCartStore((state) => state.loadCart);
  const hasLoadedCart = useCartStore((state) => state.hasLoaded);
  const items = useCartStore((state) => state.items);
  const contractorItems = useContractorOrderStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const customer = useAuthStore((state) => state.customer);
  const isContractor = isContractorCustomer(customer);
  const avatarUri =
    typeof user?.image_url === "string" && user.image_url.length > 0
      ? user.image_url
      : null;
  const fallbackInitial =
    user?.full_name?.charAt(0) ??
    user?.contact_name?.charAt(0) ??
    customer?.contact_name?.charAt(0) ??
    user?.email?.charAt(0) ??
    "Z";
  const cartItemCount = useMemo(
    () =>
      isContractor
        ? contractorItems.reduce((total, item) => total + item.quantity, 0)
        : items.reduce((total, item) => total + item.quantity, 0),
    [contractorItems, isContractor, items],
  );
  const cartBadgeLabel = cartItemCount > 99 ? "99+" : String(cartItemCount);

  useEffect(() => {
    if (isContractor || !accessToken || !customer?.id || hasLoadedCart) {
      return;
    }

    void loadCart();
  }, [accessToken, customer?.id, hasLoadedCart, isContractor, loadCart]);

  return (
    <SafeAreaView className="bg-primary-900" edges={["top"]}>
      <View className="flex-row items-center justify-between bg-primary-700 px-6 py-4 shadow-sm">
        <Text className="text-xl font-black uppercase tracking-widest text-white">
          ZOOM WIDE
        </Text>

        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityLabel="Open notifications"
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-lg bg-white/12 active:scale-95 active:opacity-70"
            onPress={() => router.push(isContractor ? "/notifications" : "/profile")}
          >
            <MaterialIcons
              name="notifications-none"
              size={23}
              color="#FFFFFF"
            />
            <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent-600" />
          </Pressable>

          <Pressable
            accessibilityLabel="Open cart"
            accessibilityRole="button"
            className="relative h-10 w-10 items-center justify-center rounded-lg bg-white/12 active:scale-95 active:opacity-70"
            onPress={() => router.push("/cart")}
          >
            <MaterialIcons name="shopping-cart" size={23} color="#FFFFFF" />
            {cartItemCount > 0 ? (
              <View className="absolute -right-1 -top-1 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1.5 py-0.5">
                <Text className="text-[10px] font-black leading-none text-white">
                  {cartBadgeLabel}
                </Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            className="h-10 w-10 overflow-hidden rounded-lg bg-white/20 active:scale-95 active:opacity-80"
            onPress={() => router.push("/profile")}
          >
            {avatarUri ? (
              <Image
                className="h-full w-full"
                resizeMode="cover"
                source={{ uri: avatarUri }}
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Text className="text-sm font-black uppercase text-white">
                  {fallbackInitial}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

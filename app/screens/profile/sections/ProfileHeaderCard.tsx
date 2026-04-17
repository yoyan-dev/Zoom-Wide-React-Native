import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { useAuthStore } from "@/store/authStore";

import { profileStyles } from "../styles";
import { TierBadge } from "../ui/TierBadge";

export function ProfileHeaderCard() {
  const router = useRouter();
  const customer = useAuthStore((state) => state.customer);
  const user = useAuthStore((state) => state.user);
  const avatar = user?.image_url ?? null;
  const badge = customer?.company_name ? "Trade" : "Pro";
  const name =
    user?.full_name ?? user?.contact_name ?? customer?.contact_name ?? "ZOOM WIDE User";
  const role =
    user?.role?.replace(/_/g, " ").toUpperCase() ?? "CUSTOMER ACCOUNT";

  return (
    <Pressable
      className="mb-10 flex-row items-center gap-6 rounded-xl bg-white p-6"
      onPress={() => router.push("/edit-profile")}
      style={profileStyles.cardShadow}
    >
      <View className="relative">
        {avatar ? (
          <Image
            className="h-24 w-24 rounded-lg"
            resizeMode="cover"
            source={{ uri: avatar }}
          />
        ) : (
          <View className="h-24 w-24 items-center justify-center rounded-lg bg-primary-900">
            <Text className="text-3xl font-black text-white">
              {name.charAt(0)}
            </Text>
          </View>
        )}
        <View className="absolute -bottom-2 -right-2 rounded-md bg-accent-600 px-2 py-1">
          <Text className="text-[10px] font-black uppercase tracking-widest text-white">
            {badge}
          </Text>
        </View>
      </View>

      <View className="flex-1">
        <Text className="mb-1 text-2xl font-black leading-none text-primary-900">
          {name}
        </Text>
        <Text className="mb-3 text-sm font-semibold text-neutral-600">
          {role}
        </Text>
        <TierBadge label={customer?.company_name ?? "ZOOM WIDE Account"} />
      </View>
    </Pressable>
  );
}

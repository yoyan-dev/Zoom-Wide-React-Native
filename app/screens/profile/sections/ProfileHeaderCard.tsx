import { Image, Text, View } from "react-native";

import { profile } from "../data";
import { profileStyles } from "../styles";
import { TierBadge } from "../ui/TierBadge";

export function ProfileHeaderCard() {
  return (
    <View
      className="mb-10 flex-row items-center gap-6 rounded-xl bg-white p-6"
      style={profileStyles.cardShadow}
    >
      <View className="relative">
        <Image
          className="h-24 w-24 rounded-lg"
          resizeMode="cover"
          source={{ uri: profile.avatar }}
        />
        <View className="absolute -bottom-2 -right-2 rounded-md bg-accent-600 px-2 py-1">
          <Text className="text-[10px] font-black uppercase tracking-widest text-white">
            {profile.badge}
          </Text>
        </View>
      </View>

      <View className="flex-1">
        <Text className="mb-1 text-2xl font-black leading-none text-primary-900">
          {profile.name}
        </Text>
        <Text className="mb-3 text-sm font-semibold text-neutral-600">
          {profile.role}
        </Text>
        <TierBadge label={profile.tier} />
      </View>
    </View>
  );
}

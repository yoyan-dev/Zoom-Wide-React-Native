import { ScrollView, Text, View } from "react-native";

import { profileOptionGroups } from "./data";
import { AccountOptionGroup } from "./sections/AccountOptionGroup";
import { ProfileHeaderCard } from "./sections/ProfileHeaderCard";
import { ProfileMetrics } from "./sections/ProfileMetrics";

export function ProfileScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 pb-32 pt-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="mx-auto w-full max-w-screen-md">
        <ProfileHeaderCard />
        <ProfileMetrics />

        <View className="gap-8">
          {profileOptionGroups.map((group) => (
            <AccountOptionGroup group={group} key={group.title} />
          ))}
        </View>

        <View className="mt-12 items-center">
          <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            ZOOM WIDE MOBILE v4.2.1
          </Text>
          <Text className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">
            Industrial Precision Engine
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

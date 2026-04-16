import { Text, View } from "react-native";

import { type ProfileOptionGroup } from "../types";
import { ProfileOptionRow } from "../ui/ProfileOptionRow";

type AccountOptionGroupProps = {
  group: ProfileOptionGroup;
};

export function AccountOptionGroup({ group }: AccountOptionGroupProps) {
  return (
    <View>
      <Text className="mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-neutral-600">
        {group.title}
      </Text>
      <View className="gap-3">
        {group.options.map((option) => (
          <ProfileOptionRow key={option.label} option={option} />
        ))}
      </View>
    </View>
  );
}

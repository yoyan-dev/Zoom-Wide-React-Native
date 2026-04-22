import { Pressable, Text, View } from "react-native";

export function ContractorSectionHeader({
  actionLabel,
  onAction,
  subtitle,
  title,
}: {
  actionLabel?: string;
  onAction?: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <View className="mb-4 flex-row items-end justify-between gap-4">
      <View className="flex-1">
        <Text className="mt-1 text-2xl font-black tracking-tight text-primary-900">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          className="rounded-md bg-primary-600 px-4 py-3 text-white"
          onPress={onAction}
        >
          <Text className="text-[11px] font-black uppercase tracking-[2px] text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

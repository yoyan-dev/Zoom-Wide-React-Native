import { Pressable, Text, View } from "react-native";

export function ContractorEmptyState({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <View className="rounded-[28px] border border-dashed border-neutral-300 bg-white px-5 py-6">
      <Text className="text-lg font-black text-primary-900">{title}</Text>
      <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          className="mt-5 self-start rounded-2xl bg-primary-900 px-4 py-3 active:bg-primary-800"
          onPress={onAction}
        >
          <Text className="text-xs font-black uppercase tracking-[2px] text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

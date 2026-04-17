import { Pressable, Text } from "react-native";

type SkipButtonProps = {
  onPress: () => void;
};

export function SkipButton({ onPress }: SkipButtonProps) {
  return (
    <Pressable className="px-1 py-3 active:opacity-60" onPress={onPress}>
      <Text className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Skip
      </Text>
    </Pressable>
  );
}

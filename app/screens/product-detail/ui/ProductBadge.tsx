import { Text, View } from "react-native";

type ProductBadgeProps = {
  label: string;
  variant: "accent" | "primary";
};

export function ProductBadge({ label, variant }: ProductBadgeProps) {
  return (
    <View
      className={[
        "self-start rounded-full px-4 py-1",
        variant === "accent" ? "bg-accent-700" : "bg-primary-900",
      ].join(" ")}
    >
      <Text className="text-xs font-black uppercase tracking-widest text-white">
        {label}
      </Text>
    </View>
  );
}

import { Text, View } from "react-native";

type SupportMetricProps = {
  label: string;
  value: string;
};

export function SupportMetric({ label, value }: SupportMetricProps) {
  return (
    <View>
      <Text className="text-[10px] font-black uppercase tracking-widest text-primary-900 opacity-40">
        {label}
      </Text>
      <Text className="text-xs font-black uppercase tracking-wider text-primary-900">
        {value}
      </Text>
    </View>
  );
}

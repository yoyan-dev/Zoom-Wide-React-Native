import { Text, TextInput, View } from "react-native";

import { type CheckoutField } from "../types";

type CheckoutInputProps = {
  field: CheckoutField;
};

export function CheckoutInput({ field }: CheckoutInputProps) {
  return (
    <View className="gap-1">
      <Text className="ml-1 text-[10px] font-black uppercase tracking-widest text-neutral-500">
        {field.label}
      </Text>
      <TextInput
        className="rounded-lg bg-neutral-200 p-4 text-base font-semibold text-neutral-900"
        keyboardType={field.keyboardType ?? "default"}
        placeholder={field.placeholder}
        placeholderTextColor="#8E97A3"
      />
    </View>
  );
}

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
        className={[
          "rounded-lg p-4 text-base font-semibold text-neutral-900",
          field.editable === false ? "bg-neutral-100 text-neutral-600" : "bg-neutral-200",
          field.multiline ? "min-h-28 pt-4" : "",
        ].join(" ")}
        editable={field.editable ?? true}
        keyboardType={field.keyboardType ?? "default"}
        multiline={field.multiline}
        onChangeText={field.onChangeText}
        placeholder={field.placeholder}
        placeholderTextColor="#8E97A3"
        textAlignVertical={field.multiline ? "top" : "center"}
        value={field.value}
      />
    </View>
  );
}

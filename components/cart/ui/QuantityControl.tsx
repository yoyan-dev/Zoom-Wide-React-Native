import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text, View } from "react-native";

type QuantityControlProps = {
  quantity: number;
};

export function QuantityControl({ quantity }: QuantityControlProps) {
  return (
    <View className="flex-row items-center rounded-lg bg-neutral-100 p-1">
      <Pressable className="h-8 w-8 items-center justify-center rounded active:bg-neutral-200">
        <MaterialIcons name="remove" size={18} color="#111418" />
      </Pressable>
      <Text className="w-10 text-center font-black text-primary-900">
        {String(quantity).padStart(2, "0")}
      </Text>
      <Pressable className="h-8 w-8 items-center justify-center rounded active:bg-neutral-200">
        <MaterialIcons name="add" size={18} color="#0A2238" />
      </Pressable>
    </View>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text, View } from "react-native";

type QuantitySelectorProps = {
  quantity: number;
};

export function QuantitySelector({ quantity }: QuantitySelectorProps) {
  return (
    <View className="h-14 flex-row items-center rounded-lg bg-neutral-200 p-1">
      <Pressable className="h-12 w-12 items-center justify-center rounded-md active:bg-white">
        <MaterialIcons name="remove" size={22} color="#111418" />
      </Pressable>
      <Text className="w-20 text-center text-lg font-black text-primary-900">
        {quantity}
      </Text>
      <Pressable className="h-12 w-12 items-center justify-center rounded-md active:bg-white">
        <MaterialIcons name="add" size={22} color="#111418" />
      </Pressable>
    </View>
  );
}

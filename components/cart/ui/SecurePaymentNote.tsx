import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

export function SecurePaymentNote() {
  return (
    <View className="mt-6 items-center gap-2">
      <MaterialIcons name="shield" size={24} color="#8E97A3" />
      <Text className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-400">
        Secure 256-bit encrypted payments
      </Text>
    </View>
  );
}

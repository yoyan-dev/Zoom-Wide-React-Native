import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text } from "react-native";

import { type PaymentMethod } from "../types";

type PaymentMethodCardProps = {
  method: PaymentMethod;
};

export function PaymentMethodCard({ method }: PaymentMethodCardProps) {
  return (
    <Pressable
      className={[
        "flex-1 items-center gap-3 rounded-lg border-2 bg-white p-6 active:opacity-75",
        method.selected ? "border-accent-600" : "border-transparent",
      ].join(" ")}
    >
      <MaterialIcons
        name={method.icon}
        size={38}
        color={method.selected ? "#D87412" : "#8E97A3"}
      />
      <Text className="text-center text-xs font-black uppercase tracking-widest text-neutral-900">
        {method.label}
      </Text>
    </Pressable>
  );
}

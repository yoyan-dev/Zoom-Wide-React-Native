import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { type FooterTrustItem } from "../types";

const footerTrustItems: FooterTrustItem[] = [
  { icon: "support-agent", label: "24/7 Field Support" },
  { icon: "policy", label: "Privacy Protocol" },
];

export function CheckoutFooter() {
  return (
    <View className="mt-12 rounded-xl bg-neutral-100 px-6 py-10">
      <View className="gap-8">
        <View>
          <Text className="text-center text-lg font-black uppercase tracking-widest text-primary-900">
            ZOOM WIDE
          </Text>
          <Text className="mt-2 text-center text-xs font-medium text-neutral-500">
            © 2024 Zoom Wide Industrial Materials. All Rights Reserved.
          </Text>
        </View>

        <View className="flex-row flex-wrap items-center justify-center gap-8">
          {footerTrustItems.map((item) => (
            <View className="flex-row items-center gap-2" key={item.label}>
              <MaterialIcons name={item.icon} size={18} color="#667080" />
              <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

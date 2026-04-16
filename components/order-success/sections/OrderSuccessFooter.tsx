import { Text, View } from "react-native";

import { footerLinks } from "../data";

export function OrderSuccessFooter() {
  return (
    <View className="bg-neutral-100/60 px-6 py-8">
      <View className="mx-auto w-full max-w-6xl gap-6">
        <View className="items-center">
          <Text className="mb-1 text-xs font-black uppercase tracking-widest text-neutral-400">
            ZOOM WIDE Industrial
          </Text>
          <Text className="text-[10px] font-medium text-neutral-600">
            © 2023 Architectural Precision Systems. All rights reserved.
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <Text
              className="text-[10px] font-black uppercase tracking-widest text-primary-900"
              key={link.label}
            >
              {link.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

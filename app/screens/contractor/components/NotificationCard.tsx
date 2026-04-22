import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import type { ContractorNotification } from "@/app/screens/contractor/types";

export function NotificationCard({
  notification,
}: {
  notification: ContractorNotification;
}) {
  return (
    <View className="rounded-[28px] bg-white p-5">
      <View className="flex-row items-start gap-4">
        <View
          className={[
            "h-12 w-12 items-center justify-center rounded-[18px]",
            notification.tone === "success"
              ? "bg-emerald-100"
              : notification.tone === "warning"
                ? "bg-amber-100"
                : "bg-primary-50",
          ].join(" ")}
        >
          <MaterialIcons
            color={
              notification.tone === "success"
                ? "#15803D"
                : notification.tone === "warning"
                  ? "#B45309"
                  : "#0A2238"
            }
            name="notifications"
            size={22}
          />
        </View>
        <View className="flex-1">
          <Text className="text-base font-black text-primary-900">
            {notification.title}
          </Text>
          <Text className="mt-2 text-sm font-medium leading-6 text-neutral-500">
            {notification.body}
          </Text>
          <Text className="mt-3 text-[11px] font-black uppercase tracking-[2px] text-neutral-400">
            {notification.dateLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { type ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

const REGULAR_TAB_META: Record<
  string,
  {
    icon: MaterialIconName;
    label: string;
  }
> = {
  index: {
    icon: "home-work",
    label: "Home",
  },
  categories: {
    icon: "grid-view",
    label: "Categories",
  },
  orders: {
    icon: "receipt-long",
    label: "Orders",
  },
  profile: {
    icon: "person",
    label: "Profile",
  },
};

const CONTRACTOR_TAB_META: Record<
  string,
  {
    icon: MaterialIconName;
    label: string;
  }
> = {
  categories: {
    icon: "inventory-2",
    label: "Materials",
  },
  index: {
    icon: "dashboard",
    label: "Dashboard",
  },
  orders: {
    icon: "receipt-long",
    label: "Orders",
  },
  profile: {
    icon: "manage-accounts",
    label: "Profile",
  },
  projects: {
    icon: "home-work",
    label: "Projects",
  },
};

const REGULAR_ACTIVE_TAB_ALIASES: Record<
  string,
  keyof typeof REGULAR_TAB_META
> = {
  "order-tracking": "orders",
  "product-detail": "categories",
  products: "categories",
};

const CONTRACTOR_ACTIVE_TAB_ALIASES: Record<
  string,
  keyof typeof CONTRACTOR_TAB_META
> = {
  "order-detail": "orders",
  "order-tracking": "orders",
  "product-detail": "categories",
  "project-detail": "projects",
  "project-form": "projects",
  products: "categories",
};

export function AppTabBar({
  descriptors,
  navigation,
  state,
}: BottomTabBarProps) {
  const customer = useAuthStore((state) => state.customer);
  const isContractor = isContractorCustomer(customer);
  const tabMeta = isContractor ? CONTRACTOR_TAB_META : REGULAR_TAB_META;
  const activeAliases = isContractor
    ? CONTRACTOR_ACTIVE_TAB_ALIASES
    : REGULAR_ACTIVE_TAB_ALIASES;
  const visibleRoutes = state.routes.filter((route) => route.name in tabMeta);
  const activeRouteName = state.routes[state.index]?.name;
  const activeTabName = activeAliases[activeRouteName] ?? activeRouteName;

  return (
    <SafeAreaView className="bg-neutral-50/95" edges={["bottom"]}>
      <View className="flex-row items-center justify-around rounded-t-lg bg-neutral-50/95 px-4 py-3 shadow-lg">
        {visibleRoutes.map((route) => {
          const isFocused = activeTabName === route.name;
          const metadata = tabMeta[route.name] ?? {
            icon: "circle",
            label: descriptors[route.key]?.options.title ?? route.name,
          };

          const onPress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: "tabPress",
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              className={[
                "items-center justify-center rounded-xl px-4 py-2 active:scale-90",
                isFocused ? "bg-accent-50" : "",
              ].join(" ")}
              key={route.key}
              onPress={onPress}
            >
              <MaterialIcons
                color={isFocused ? "#D87412" : "#667080"}
                name={metadata.icon}
                size={24}
              />
              <Text
                className={[
                  "mt-1 text-[10px] font-black uppercase tracking-widest",
                  isFocused ? "text-accent-600" : "text-neutral-500",
                ].join(" ")}
              >
                {metadata.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

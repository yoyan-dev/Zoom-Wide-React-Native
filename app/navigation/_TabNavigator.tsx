import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";

import { AppHeader } from "./_components/AppHeader";
import { AppTabBar } from "./_components/AppTabBar";

export function TabNavigator() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <AppTabBar {...props} />}
      screenOptions={{
        header: () => <AppHeader />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="product-detail"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="order-tracking"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

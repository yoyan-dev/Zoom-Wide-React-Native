import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";

import { useAuthStore } from "@/store/authStore";
import { isContractorCustomer } from "@/utils/customerAccess";

import { AppHeader } from "./_components/AppHeader";
import { AppTabBar } from "./_components/AppTabBar";

export function TabNavigator() {
  const customer = useAuthStore((state) => state.customer);
  const isContractor = isContractorCustomer(customer);

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
          title: isContractor ? "Dashboard" : "Home",
        }}
      />
      {isContractor ? (
        <Tabs.Screen
          name="projects"
          options={{
            title: "Projects",
          }}
        />
      ) : null}
      <Tabs.Screen
        name="categories"
        options={{
          title: isContractor ? "Materials" : "Categories",
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

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { useAuthStore } from "@/store/authStore";

const PUBLIC_ROUTES = new Set(["/splash", "/login", "/signup"]);

function useAuthGate() {
  const hasRestoredSession = useAuthStore((state) => state.hasRestoredSession);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const status = useAuthStore((state) => state.status);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (!hasRestoredSession || pathname === "/splash") {
      return;
    }

    const isAuthenticated = status === "authenticated";
    const isPublicRoute = PUBLIC_ROUTES.has(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      router.replace("/");
    }
  }, [hasRestoredSession, pathname, router, status]);
}

export function RootNavigator() {
  const colorScheme = useColorScheme();
  useAuthGate();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="delivery-addresses" options={{ headerShown: false }} />
        <Stack.Screen name="add-delivery-address" options={{ headerShown: false }} />
        <Stack.Screen name="edit-delivery-address" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="security-settings" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="project-form" options={{ headerShown: false }} />
        <Stack.Screen name="project-detail" options={{ headerShown: false }} />
        <Stack.Screen name="order-detail" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="order-success" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}

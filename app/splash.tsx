import { useRouter } from "expo-router";
import { useEffect } from "react";

import { SplashScreen } from "@/app/screens/splash/SplashScreen";
import { useAuthStore } from "@/store/authStore";

const SPLASH_DURATION_MS = 2200;

export default function SplashRoute() {
  const router = useRouter();
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      void restoreSession().finally(() => {
        if (!isMounted) {
          return;
        }

        router.replace(
          useAuthStore.getState().status === "authenticated" ? "/" : "/login",
        );
      });
    }, SPLASH_DURATION_MS);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [restoreSession, router]);

  return <SplashScreen />;
}

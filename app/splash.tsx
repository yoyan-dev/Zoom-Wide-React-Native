import { useRouter } from "expo-router";
import { useEffect } from "react";

import { SplashScreen } from "@/components/splash/SplashScreen";

const SPLASH_DURATION_MS = 2200;

export default function SplashRoute() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}

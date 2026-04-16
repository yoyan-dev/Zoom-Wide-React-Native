import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";

import { EasyOrderingPage } from "./pages/EasyOrderingPage";
import { ProGradeSupportPage } from "./pages/ProGradeSupportPage";
import { QualityMaterialsPage } from "./pages/QualityMaterialsPage";

export function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const finishOnboarding = () => {
    router.replace("/");
  };

  const goNext = () => {
    setActiveIndex((current) => Math.min(current + 1, 2));
  };

  return (
    <View className="flex-1">
      <StatusBar style={activeIndex === 1 ? "dark" : "light"} translucent />

      {activeIndex === 0 ? (
        <QualityMaterialsPage
          activeIndex={activeIndex}
          onNext={goNext}
          onSkip={finishOnboarding}
        />
      ) : null}

      {activeIndex === 1 ? (
        <EasyOrderingPage
          activeIndex={activeIndex}
          onNext={goNext}
          onSkip={finishOnboarding}
        />
      ) : null}

      {activeIndex === 2 ? (
        <ProGradeSupportPage
          activeIndex={activeIndex}
          onDone={finishOnboarding}
        />
      ) : null}
    </View>
  );
}

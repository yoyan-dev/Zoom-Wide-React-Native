import { View } from "react-native";

import { ONBOARDING_PAGE_COUNT } from "../constants";

type PagerDotsProps = {
  activeIndex: number;
};

export function PagerDots({ activeIndex }: PagerDotsProps) {
  return (
    <View className="flex-row items-center gap-2">
      {Array.from({ length: ONBOARDING_PAGE_COUNT }, (_, index) => (
        <View
          key={index}
          className={[
            "h-1.5 rounded-full",
            activeIndex === index ? "w-8 bg-accent-600" : "w-2 bg-neutral-300",
          ].join(" ")}
        />
      ))}
    </View>
  );
}

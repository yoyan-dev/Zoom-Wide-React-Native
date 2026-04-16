import { useMemo } from "react";
import {
  ImageBackground,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { onboardingImages } from "../constants";
import { onboardingStyles } from "../styles";
import { type StepPageProps } from "../types";
import { FeatureChip } from "../ui/FeatureChip";
import { PagerDots } from "../ui/PagerDots";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SkipButton } from "../ui/SkipButton";

export function QualityMaterialsPage({
  activeIndex,
  onNext,
  onSkip,
}: StepPageProps) {
  const { height } = useWindowDimensions();
  const heroHeight = useMemo(
    () => Math.max(430, Math.min(530, height * 0.6)),
    [height],
  );

  return (
    <View className="flex-1 overflow-hidden bg-neutral-50">
      <View
        className="relative w-full overflow-hidden bg-primary-900"
        style={{ height: heroHeight }}
      >
        <ImageBackground
          className="h-full w-full"
          imageStyle={onboardingStyles.heroImage}
          resizeMode="cover"
          source={{ uri: onboardingImages.materials }}
        >
          <View className="absolute inset-0 bg-primary-900 opacity-45" />
          <View className="absolute inset-x-0 bottom-0 h-44 bg-primary-900 opacity-30" />

          <SafeAreaView className="flex-1">
            <View className="px-8 pt-8">
              <View className="self-start rounded-sm bg-accent-600 px-3 py-1">
                <Text className="text-[10px] font-black uppercase tracking-widest text-white">
                  Chapter 01
                </Text>
              </View>

              <Text className="mt-4 text-5xl font-black uppercase leading-none tracking-tighter text-white">
                QUALITY{"\n"}MATERIALS
              </Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
        <View className="absolute -bottom-10 left-0 right-0 h-20 rotate-[-5deg] bg-neutral-50" />
      </View>

      <View className="-mt-5 flex-1 justify-between px-8 pb-10 pt-10">
        <View>
          <View className="mb-8 h-1 w-20 bg-accent-600" />
          <Text className="max-w-lg text-lg font-medium leading-8 text-neutral-600">
            Sourcing only the most durable, industry-certified supplies for your
            architectural vision. From foundation to finish, we guarantee
            structural integrity.
          </Text>

          <View className="mt-8 flex-row gap-4">
            <FeatureChip icon="verified" label="Certified Grade" />
            <FeatureChip icon="precision-manufacturing" label="Bulk Supply" />
          </View>
        </View>

        <View className="mt-10 flex-row items-center justify-between">
          <SkipButton onPress={onSkip} />
          <View className="flex-row items-center gap-6">
            <PagerDots activeIndex={activeIndex} />
            <PrimaryButton label="Next" onPress={onNext} />
          </View>
        </View>
      </View>

      <Text className="absolute -right-16 top-1/2 text-[190px] font-black leading-none text-primary-900 opacity-[0.03]">
        01
      </Text>
    </View>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { onboardingImages } from "../constants";
import { onboardingStyles } from "../styles";
import { type FinalStepPageProps } from "../types";
import { PagerDots } from "../ui/PagerDots";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SupportMetric } from "../ui/SupportMetric";

export function ProGradeSupportPage({
  activeIndex,
  onDone,
}: FinalStepPageProps) {
  return (
    <View className="relative flex-1 justify-end overflow-hidden bg-neutral-50">
      <View className="absolute inset-x-0 top-0 h-[65%]">
        <Image
          className="h-full w-full"
          resizeMode="cover"
          source={{ uri: onboardingImages.support }}
        />
        <View className="absolute inset-0 bg-white opacity-10" />
        <View className="absolute inset-x-0 bottom-0 h-64 bg-neutral-50 opacity-90" />
      </View>

      <SafeAreaView className="absolute left-0 right-0 top-0 z-20">
        <View className="px-8 pt-3">
          <Text className="text-2xl font-black uppercase tracking-widest text-primary-900">
            ZOOM WIDE
          </Text>
        </View>
      </SafeAreaView>

      <View className="relative z-10 items-center px-6 pb-12">
        <View
          className="w-full max-w-lg rounded-xl border border-white/40 bg-white/90 p-8"
          style={onboardingStyles.glassPanel}
        >
          <View className="gap-4">
            <View className="self-start rounded-full bg-primary-100 px-3 py-1">
              <Text className="text-[10px] font-black uppercase tracking-widest text-primary-800">
                Phase 03: Support
              </Text>
            </View>
            <Text className="text-4xl font-black uppercase leading-none tracking-tighter text-primary-900">
              PRO-GRADE SUPPORT.{"\n"}EVERY STEP.
            </Text>
            <Text className="text-base font-semibold leading-7 text-neutral-600">
              Access dedicated account managers, technical CAD drawings, and
              project-specific pricing to keep your builds on schedule and under
              budget.
            </Text>
          </View>

          <View className="pt-6">
            <PagerDots activeIndex={activeIndex} />
          </View>

          <View className="pt-6">
            <PrimaryButton label="Get Started" onPress={onDone} />
          </View>
        </View>

        <View className="mt-8 w-full max-w-lg flex-row items-center justify-between px-2">
          <View className="flex-row items-center gap-4">
            <SupportMetric label="Industry" value="BIM Enabled" />
            <View className="h-8 w-px bg-neutral-300" />
            <SupportMetric label="Pricing" value="Trade Exclusive" />
          </View>
          <MaterialIcons name="verified" size={28} color="#0A2238" />
        </View>
      </View>

      <View className="absolute left-1/4 top-1/4 h-32 w-32 border-l border-t border-primary-100" />
      <View className="absolute bottom-1/4 right-1/4 h-32 w-32 border-b border-r border-primary-100" />
    </View>
  );
}

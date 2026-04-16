import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { onboardingImages } from "../constants";
import { onboardingStyles } from "../styles";
import { type StepPageProps } from "../types";
import { PagerDots } from "../ui/PagerDots";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SkipButton } from "../ui/SkipButton";
import { SpecCard } from "../ui/SpecCard";

export function EasyOrderingPage({
  activeIndex,
  onNext,
  onSkip,
}: StepPageProps) {
  return (
    <View className="flex-1 bg-neutral-50">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-8 py-5">
          <Text className="text-xl font-black uppercase tracking-widest text-primary-900">
            ZOOM WIDE
          </Text>
          <SkipButton onPress={onSkip} />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="grow justify-between"
          showsVerticalScrollIndicator={false}
        >
          <View className="relative items-center px-6 pb-8 pt-4">
            <View className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-primary-100 opacity-40" />
            <View className="absolute -right-24 bottom-8 h-96 w-96 rounded-full bg-accent-100 opacity-35" />

            <View className="w-full max-w-md gap-6">
              <View
                className="overflow-hidden rounded-xl bg-white"
                style={onboardingStyles.cardShadow}
              >
                <Image
                  className="h-72 w-full"
                  resizeMode="cover"
                  source={{ uri: onboardingImages.ordering }}
                />
                <View className="flex-row items-center justify-between p-6">
                  <View>
                    <Text className="mb-1 text-xs font-black uppercase tracking-widest text-accent-700">
                      Status Update
                    </Text>
                    <Text className="text-lg font-black tracking-tight text-primary-900">
                      Delivery En Route
                    </Text>
                  </View>
                  <View className="rounded-lg bg-primary-100 p-3">
                    <MaterialIcons
                      name="local-shipping"
                      size={26}
                      color="#0A2238"
                    />
                  </View>
                </View>
              </View>

              <View className="flex-row gap-4">
                <SpecCard
                  body="Order materials directly from the job site with one tap."
                  icon="qr-code-scanner"
                  iconColor="#0A2238"
                  title="Scan & Ship"
                />
                <SpecCard
                  body="Precision tracking keeps your crew moving without delays."
                  icon="schedule"
                  iconColor="#D87412"
                  title="Rapid Arrival"
                />
              </View>
            </View>
          </View>

          <View
            className="rounded-t-[40px] bg-white px-8 pb-12 pt-12"
            style={onboardingStyles.sheetShadow}
          >
            <View className="mx-auto w-full max-w-md">
              <View className="mb-10">
                <View className="mb-6 self-start rounded-full bg-primary-100 px-3 py-1">
                  <Text className="text-[10px] font-black uppercase tracking-widest text-primary-900">
                    Efficiency First
                  </Text>
                </View>

                <Text className="mb-4 text-4xl font-black uppercase leading-none tracking-tighter text-primary-900">
                  EASY ORDERING.{"\n"}ZERO DOWNTIME.
                </Text>
                <Text className="max-w-[90%] text-base font-semibold leading-7 text-neutral-600">
                  The ultimate supply chain in your pocket. Source
                  industrial-grade materials, track site deliveries, and manage
                  specs in real-time.
                </Text>
              </View>

              <PrimaryButton label="Continue Journey" onPress={onNext} />
              <View className="items-center pt-6">
                <PagerDots activeIndex={activeIndex} />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

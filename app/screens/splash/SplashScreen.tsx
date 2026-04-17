import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import { type ComponentProps, useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const gridStops = [16, 34, 52, 70, 88];

function LoadingDots() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [progress]);

  const dotOneOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 1, 0.35],
  });
  const dotTwoOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.55, 0.2],
  });
  const dotThreeOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.12, 0.35, 0.12],
  });

  return (
    <View className="flex-row items-center gap-1.5">
      <Animated.View
        className="h-1.5 w-1.5 rounded-full bg-primary-900"
        style={{ opacity: dotOneOpacity }}
      />
      <Animated.View
        className="h-1.5 w-1.5 rounded-full bg-primary-900"
        style={{ opacity: dotTwoOpacity }}
      />
      <Animated.View
        className="h-1.5 w-1.5 rounded-full bg-primary-900"
        style={{ opacity: dotThreeOpacity }}
      />
    </View>
  );
}

function IndustrialBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View className="absolute inset-0 bg-neutral-50" />

      <View className="absolute inset-0 opacity-25">
        {gridStops.map((stop) => (
          <View
            key={`row-${stop}`}
            className="absolute left-0 right-0 h-px bg-neutral-200"
            style={{ top: `${stop}%` }}
          />
        ))}
        {gridStops.map((stop) => (
          <View
            key={`column-${stop}`}
            className="absolute bottom-0 top-0 w-px bg-neutral-200"
            style={{ left: `${stop}%` }}
          />
        ))}
      </View>

      <View className="absolute inset-0 items-center justify-center opacity-[0.04]">
        <Text
          adjustsFontSizeToFit
          className="text-center text-[100px] font-black uppercase text-primary-900"
          numberOfLines={1}
        >
          ZOOM WIDE
        </Text>
      </View>

      <View className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-900 opacity-[0.05]" />
      <View className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-accent-500 opacity-[0.08]" />
      <View className="absolute inset-x-0 top-0 h-48 bg-white opacity-40" />
    </View>
  );
}

function CertificationItem({
  icon,
  label,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <MaterialIcons name={icon} size={20} color="#667080" />
      <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
        {label}
      </Text>
    </View>
  );
}

export function SplashScreen() {
  return (
    <View className="relative flex-1 overflow-hidden bg-neutral-50">
      <StatusBar style="dark" translucent />
      <IndustrialBackdrop />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <View
              className="items-center justify-center rounded-full bg-white/40 p-8"
              style={styles.logoHalo}
            >
              <Image
                accessibilityLabel="ZOOM WIDE logo"
                className="h-36 w-48"
                resizeMode="contain"
                source={require("../../../public/app-icon.png")}
              />
            </View>

            <View className="mt-8 items-center">
              <Text className="text-center text-3xl font-black uppercase tracking-widest text-primary-900">
                ZOOM WIDE
              </Text>

              <View className="mt-3 flex-row items-center gap-3">
                <View className="h-0.5 w-8 bg-accent-600" />
                <Text className="text-center text-xs font-extrabold uppercase tracking-widest text-neutral-600">
                  Construction Supplies
                </Text>
                <View className="h-0.5 w-8 bg-accent-600" />
              </View>
            </View>
          </View>

          <View className="mt-20 items-center gap-6">
            <LoadingDots />
            <Text className="text-center text-xs font-black uppercase tracking-widest text-neutral-400">
              Initializing Infrastructure
            </Text>
          </View>
        </View>

        <View className="items-center px-6 pb-9">
          <View className="flex-row flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-70">
            <CertificationItem
              icon="architecture"
              label="Architectural Grade"
            />
            <CertificationItem icon="verified" label="Industry Certified" />
          </View>

          <View className="mt-6 items-center">
            <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Build with Precision
            </Text>
            <View className="mt-2 h-px w-12 bg-neutral-200" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoHalo: {
    elevation: 10,
    shadowColor: "#0A2238",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
});
